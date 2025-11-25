import { createSlice } from "@reduxjs/toolkit";
import { generateAutoPlacement } from "../utils/shipUtils";
import { processShot } from "../utils/gameLogicUtils";
import { getEnemyShot, resetAIMemory } from "../utils/enemyLogic";

// фази гри
export const GamePhase = {
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

// допоміжні функції
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const resetShipState = (ship) => ({
    ...ship,
    hits: [],
    isSunk: false,
});

const normalizeShips = (ships) => (ships || []).map(resetShipState);

const generateInitialEnemyBoard = () => ({
    ...initialBoardState,
    ships: normalizeShips(generateAutoPlacement()),
});

// початковий стан Redux
const initialState = {
    phase: GamePhase.START,
    currentTurn: "player",
    playerBoard: initialBoardState,
    enemyBoard: generateInitialEnemyBoard(),
    winner: null,
    score: { wins: 0, losses: 0 },
    baselinePlayerShips: null,
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setPhase(state, action) {
            state.phase = action.payload;
        },

        setScore(state, action) {
            state.score = action.payload;
        },

        // старт гри після розставлення кораблів
        startGameWithShips(state, action) {
            resetAIMemory();

            const cleanShips = normalizeShips(deepClone(action.payload));

            state.phase = GamePhase.GAME;
            state.playerBoard = { ships: cleanShips, hits: {} };
            state.enemyBoard = {
                ...initialBoardState,
                ships: normalizeShips(generateAutoPlacement()),
            };

            state.baselinePlayerShips = deepClone(cleanShips);
            state.winner = null;
            state.currentTurn = "player";
        },

        // почати ту саму гру з тією ж розкладкою
        restartGame(state) {
            resetAIMemory();

            const sourceShips =
                state.baselinePlayerShips?.length
                    ? state.baselinePlayerShips
                    : state.playerBoard.ships;

            state.phase = GamePhase.GAME;
            state.currentTurn = "player";

            state.playerBoard = {
                ships: normalizeShips(deepClone(sourceShips)),
                hits: {},
            };

            state.enemyBoard = {
                ...initialBoardState,
                ships: normalizeShips(generateAutoPlacement()),
            };

            state.winner = null;
        },

        // логіка пострілу (гравець або бот)
        takeShot(state, action) {
            const { coord, shooter } = action.payload;

            const target = shooter === "player" ? "enemy" : "player";
            const targetBoardKey = target === "enemy" ? "enemyBoard" : "playerBoard";
            const targetBoard = state[targetBoardKey];

            if (coord && targetBoard.hits[coord]) return;

            const shotResult = processShot(coord, targetBoard.ships);

            const newHits = { ...targetBoard.hits };
            newHits[coord] = shotResult.isHit ? "hit" : "miss";

            if (shotResult.sunkShipPositions?.length) {
                shotResult.sunkShipPositions.forEach((pos) => {
                    newHits[pos] = "sunk";
                });
            }

            state[targetBoardKey] = {
                ships: shotResult.updatedShips,
                hits: newHits,
            };

            state.currentTurn = shotResult.isHit
                ? shooter
                : shooter === "player"
                    ? "enemy"
                    : "player";

            if (shotResult.allSunk) {
                state.winner = shooter;
            }
        },

        // передати хід ворогу, коли в гравця вийшов час
        endPlayerTurn(state) {
            state.currentTurn = "enemy";
        },

        incrementWin(state) {
            state.score.wins += 1;
            localStorage.setItem("battleship-score", JSON.stringify(state.score));
        },

        incrementLoss(state) {
            state.score.losses += 1;
            localStorage.setItem("battleship-score", JSON.stringify(state.score));
        },

        nextRound(state) {
            resetAIMemory();
            state.phase = GamePhase.PLACEMENT;
            state.currentTurn = "player";
            state.winner = null;
        },

        resetScore(state) {
            state.score = { wins: 0, losses: 0 };
            localStorage.removeItem("battleship-score");
        },

        surrender(state) {
            state.winner = "enemy";
        },

        // постріл бота — окремий редʼюсер, який використовує AI
        executeEnemyTurn(state, action) {
            const { settings } = action.payload;
            const coord = getEnemyShot(state.playerBoard, settings.aiMode);
            if (!coord) return;

            const shotResult = processShot(coord, state.playerBoard.ships);

            const newHits = { ...state.playerBoard.hits };
            newHits[coord] = shotResult.isHit ? "hit" : "miss";

            if (shotResult.sunkShipPositions?.length) {
                shotResult.sunkShipPositions.forEach((pos) => {
                    newHits[pos] = "sunk";
                });
            }

            state.playerBoard = {
                ships: shotResult.updatedShips,
                hits: newHits,
            };

            state.currentTurn = shotResult.isHit ? "enemy" : "player";

            if (shotResult.allSunk) {
                state.winner = "enemy";
            }
        },
    },
});

// middleware: якщо зараз хід бота — через затримку викликаємо executeEnemyTurn
export const botTurnMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    const state = store.getState();
    const { game, settings } = state;

    if (
        game.phase === GamePhase.GAME &&
        game.currentTurn === "enemy" &&
        !game.winner
    ) {
        setTimeout(() => {
            const latestState = store.getState();
            const { game: g2, settings: s2 } = latestState;

            if (
                g2.phase === GamePhase.GAME &&
                g2.currentTurn === "enemy" &&
                !g2.winner
            ) {
                store.dispatch(
                    gameSlice.actions.executeEnemyTurn({ settings: s2 })
                );
            }
        }, settings.enemyDelay || 1000);
    }

    return result;
};

export const {
    setPhase,
    setScore,
    startGameWithShips,
    restartGame,
    takeShot,
    incrementWin,
    incrementLoss,
    nextRound,
    resetScore,
    surrender,
    endPlayerTurn,
    executeEnemyTurn,
} = gameSlice.actions;

export default gameSlice.reducer;
