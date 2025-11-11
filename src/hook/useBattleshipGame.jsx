import { useReducer, useMemo, useEffect, useCallback } from "react";
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

const generateInitialEnemyBoard = () => ({
    ...initialBoardState,
    ships: generateAutoPlacement(),
});

const initialState = {
    phase: GamePhase.START,
    currentTurn: "player",
    playerBoard: initialBoardState,
    enemyBoard: generateInitialEnemyBoard(),
    winner: null,
};

// REDUCER
function gameReducer(state, action) {
    switch (action.type) {
        case "SET_PHASE":
            return { ...state, phase: action.payload };

        case "RESTART_GAME":
            // Скидаємо пам’ять бота при новій грі
            resetAIMemory();
            return {
                ...initialState,
                enemyBoard: { ...initialBoardState, ships: generateAutoPlacement() },
            };

        case "START_GAME_WITH_SHIPS":
            // Скидаємо пам’ять бота при старті бою
            resetAIMemory();
            return {
                ...state,
                phase: GamePhase.GAME,
                playerBoard: { ...state.playerBoard, ships: action.payload },
            };

        case "TAKE_SHOT": {
            const { coord, shooter } = action.payload;
            const target = shooter === "player" ? "enemy" : "player";
            const targetBoardKey = target === "enemy" ? "enemyBoard" : "playerBoard";
            const targetBoard = state[targetBoardKey];

            if (coord && targetBoard.hits[coord]) return state; // не стріляємо двічі

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
                winner: shotResult.allSunk ? shooter : null,
            };

            if (shotResult.allSunk) nextState.phase = GamePhase.RESULT;
            return nextState;
        }

        case "END_PLAYER_TURN":
            return { ...state, currentTurn: "enemy" };

        case "SURRENDER":
            return {
                ...state,
                phase: GamePhase.RESULT,
                winner: action.payload === "player" ? "enemy" : "player",
            };

        default:
            return state;
    }
}

export function useBattleshipGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { settings } = useSettings();

    // постріл
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

    // експорт дій
    const actions = useMemo(
        () => ({
            takeShot,
            startGame: (playerShips) =>
                dispatch({ type: "START_GAME_WITH_SHIPS", payload: playerShips }),
            startPlacement: () => dispatch({ type: "SET_PHASE", payload: "placement" }),
            showRules: () => dispatch({ type: "SET_PHASE", payload: "rules" }),
            hideRules: () => dispatch({ type: "SET_PHASE", payload: "start" }),
            openSettings: () => dispatch({ type: "SET_PHASE", payload: "settings" }),
            surrender: () => dispatch({ type: "SURRENDER", payload: "player" }),
            restartGame: () => dispatch({ type: "RESTART_GAME" }),
            endPlayerTurn: () => dispatch({ type: "END_PLAYER_TURN" }),
        }),
        [takeShot]
    );

    return [state, actions, GamePhase];
}
