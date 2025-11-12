import { useReducer, useMemo, useEffect, useCallback, useState } from "react";
import { processShot } from "../utils/gameLogicUtils";
import { generateAutoPlacement } from "../utils/shipUtils";
import { useSettings } from "../context/SettingsContext.jsx";
import { getEnemyShot, resetAIMemory } from "../utils/enemyLogic";

const GamePhase = {
    START: "start",
    SETTINGS: "settings",
    PLACEMENT: "placement",
    GAME: "game",
    RESULT: "result",
    RULES: "rules",
};

const initialBoardState = {
    ships: [],
    hits: {},
};

// Глибоке клонування простих структур
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Скидання службових станів корабля до "чистого"
const resetShipState = (s) => ({
    ...s,
    hits: Array.isArray(s.hits) ? [] : [],
    isSunk: false,
    sunk: false,
});

// Нормалізація масиву кораблів: кожному гарантуємо правильні поля
const normalizeShips = (ships) => (ships || []).map((s) => resetShipState(s));

const generateInitialEnemyBoard = () => ({
    ...initialBoardState,
    ships: normalizeShips(generateAutoPlacement()),
});

const initialState = {
    phase: GamePhase.START,
    currentTurn: "player",
    playerBoard: initialBoardState,
    enemyBoard: generateInitialEnemyBoard(),
    winner: null,
    score: { wins: 0, losses: 0 },
    baselinePlayerShips: null, // базова розкладка гравця для "Почати заново"
};

// REDUCER
function gameReducer(state, action) {
    switch (action.type) {
        case "SET_PHASE":
            return { ...state, phase: action.payload };

        case "SET_SCORE":
            return { ...state, score: action.payload };

        // Почати заново : залишає ті ж кораблі гравця (чиста копія), ворогу — нові
        case "RESTART_GAME": {
            resetAIMemory();

            const sourceShips =
                state.baselinePlayerShips && state.baselinePlayerShips.length
                    ? state.baselinePlayerShips
                    : state.playerBoard.ships;

            return {
                ...state,
                phase: GamePhase.GAME,
                currentTurn: "player",
                playerBoard: {
                    ships: normalizeShips(deepClone(sourceShips)),
                    hits: {},
                },
                enemyBoard: {
                    ...initialBoardState,
                    ships: normalizeShips(generateAutoPlacement()),
                },
                winner: null,
                score: state.score,
            };
        }

        // Початок гри після розстановки кораблів, фіксуємо еталонну розкладку
        case "START_GAME_WITH_SHIPS": {
            resetAIMemory();
            const cleanShips = normalizeShips(deepClone(action.payload));

            return {
                ...state,
                phase: GamePhase.GAME,
                playerBoard: { ships: deepClone(cleanShips), hits: {} },
                enemyBoard: { ...initialBoardState, ships: normalizeShips(generateAutoPlacement()) },
                winner: null,
                baselinePlayerShips: deepClone(cleanShips),
            };
        }

        // Обробка пострілу
        case "TAKE_SHOT": {
            const { coord, shooter } = action.payload;
            const target = shooter === "player" ? "enemy" : "player";
            const targetBoardKey = target === "enemy" ? "enemyBoard" : "playerBoard";
            const targetBoard = state[targetBoardKey];

            if (coord && targetBoard.hits[coord]) return state; // не стріляємо двічі в те саме

            const shotResult = coord ? processShot(coord, targetBoard.ships) : { isHit: false };

            const newHits = { ...targetBoard.hits };
            if (coord) {
                const hitState = shotResult.isHit ? "hit" : "miss";
                newHits[coord] = hitState;

                if (shotResult.sunkShipPositions?.length) {
                    shotResult.sunkShipPositions.forEach((pos) => {
                        newHits[pos] = "sunk";
                    });
                }
            }

            const newBoard = {
                ships: shotResult.updatedShips || targetBoard.ships,
                hits: newHits,
            };

            const nextState = {
                ...state,
                [targetBoardKey]: newBoard,
                currentTurn: shotResult.isHit
                    ? shooter
                    : shooter === "player"
                        ? "enemy"
                        : "player",
                winner: shotResult.allSunk ? shooter : state.winner,
            };

            return nextState;
        }

        case "INCREMENT_WIN": {
            const updated = { ...state.score, wins: state.score.wins + 1 };
            localStorage.setItem("battleship-score", JSON.stringify(updated));
            return { ...state, score: updated };
        }

        case "INCREMENT_LOSS": {
            const updated = { ...state.score, losses: state.score.losses + 1 };
            localStorage.setItem("battleship-score", JSON.stringify(updated));
            return { ...state, score: updated };
        }

        // Наступний тур, повернення на етап розстановки кораблів
        case "NEXT_ROUND":
            resetAIMemory();
            return {
                ...state,
                phase: GamePhase.PLACEMENT,
                currentTurn: "player",
                winner: null,
            };

        // Обнулення рахунку
        case "RESET_SCORE":
            localStorage.removeItem("battleship-score");
            return { ...state, score: { wins: 0, losses: 0 } };

        case "END_PLAYER_TURN":
            return { ...state, currentTurn: "enemy" };

        case "SURRENDER":
            return { ...state, winner: "enemy" };

        default:
            return state;
    }
}

export function useBattleshipGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { settings } = useSettings();

    // Флаг, щоб рахунок оновився рівно один раз за раунд
    const [scoreUpdated, setScoreUpdated] = useState(false);

    // Зчитуємо рахунок із localStorage
    useEffect(() => {
        const savedScore = localStorage.getItem("battleship-score");
        if (savedScore) {
            try {
                const parsed = JSON.parse(savedScore);
                dispatch({ type: "SET_SCORE", payload: parsed });
            } catch {
                console.warn("Invalid score data in storage");
            }
        }
    }, []);

    // Постріл
    const takeShot = useCallback((coord, shooter = "player") => {
        dispatch({ type: "TAKE_SHOT", payload: { coord, shooter } });
    }, []);

    // логіка бота
    useEffect(() => {
        if (state.phase !== GamePhase.GAME || state.currentTurn !== "enemy" || state.winner)
            return;

        const timer = setTimeout(() => {
            const enemyShotCoord = getEnemyShot(state.playerBoard, settings.aiMode);
            if (enemyShotCoord) {
                takeShot(enemyShotCoord, "enemy");
            }
        }, settings.enemyDelay || 1000);

        return () => clearTimeout(timer);
    }, [
        state.phase,
        state.currentTurn,
        state.playerBoard.hits,
        state.winner,
        takeShot,
        settings,
    ]);

    // Автоматично оновити рахунок один раз після визначення переможця
    useEffect(() => {
        if (state.winner && !scoreUpdated) {
            if (state.winner === "player") {
                dispatch({ type: "INCREMENT_WIN" });
            } else if (state.winner === "enemy") {
                dispatch({ type: "INCREMENT_LOSS" });
            }
            setScoreUpdated(true);
        }
        // Скинути флаг при старті нового туру (коли winner зник)
        if (!state.winner && scoreUpdated) {
            setScoreUpdated(false);
        }
    }, [state.winner, scoreUpdated]);

    // Експорт дій
    const actions = useMemo(
        () => ({
            takeShot,
            startGame: (playerShips) =>
                dispatch({ type: "START_GAME_WITH_SHIPS", payload: playerShips }),
            startPlacement: () => dispatch({ type: "SET_PHASE", payload: "placement" }),
            showRules: () => dispatch({ type: "SET_PHASE", payload: "rules" }),
            hideRules: () => dispatch({ type: "SET_PHASE", payload: "start" }),
            openSettings: () => dispatch({ type: "SET_PHASE", payload: "settings" }),

            // Здатися: тільки фіксує переможця, рахунок додасть useEffect
            surrender: () => {
                dispatch({ type: "SURRENDER", payload: "player" });
            },

            restartGame: () => dispatch({ type: "RESTART_GAME" }),
            nextRound: () => dispatch({ type: "NEXT_ROUND" }),
            endPlayerTurn: () => dispatch({ type: "END_PLAYER_TURN" }),
            resetScore: () => dispatch({ type: "RESET_SCORE" }),
        }),
        [takeShot]
    );

    return [state, actions, GamePhase];
}
