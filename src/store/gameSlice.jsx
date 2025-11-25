import { createSlice } from "@reduxjs/toolkit";
import { generateAutoPlacement } from "../utils/shipUtils";
import { processShot } from "../utils/gameLogicUtils";
import { getEnemyShot, resetAIMemory } from "../utils/enemyLogic";

export const GamePhase = {
    START: "start",
    SETTINGS: "settings",
    PLACEMENT: "placement",
    GAME: "game",
    RESULT: "result",
    RULES: "rules",
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const resetShipState = (ship) => ({
    ...ship,
    hits: [],
    isSunk: false,
});

const normalizeShips = (ships) => (ships || []).map(resetShipState);

const generateInitialEnemyBoard = () => ({
    ships: normalizeShips(generateAutoPlacement()),
    hits: {},
});

const getInitialState = () => ({
    phase: GamePhase.START,
    currentTurn: "player",

    playerBoard: { ships: [], hits: {} },
    enemyBoard: generateInitialEnemyBoard(),

    winner: null,

    score: { wins: 0, losses: 0 },

    history: [], // ДОДАНО: ініціалізація history як пустого масиву
    currentRound: 1,

    baselinePlayerShips: null,
});

const gameSlice = createSlice({
    name: "game",
    initialState: getInitialState(),
    reducers: {
        setPhase(state, action) {
            state.phase = action.payload;
        },

        addRoundToHistory(state, action) {
            // ПЕРЕВІРКА: переконатися, що history існує
            if (!state.history) {
                state.history = [];
            }
            state.history.push({
                roundNumber: state.currentRound,
                ...action.payload,
                timestamp: Date.now(),
            });
            state.currentRound += 1;
        },

        setScore(state, action) {
            state.score = action.payload;
        },

        startGameWithShips(state, action) {
            resetAIMemory();

            const cleanShips = normalizeShips(deepClone(action.payload));

            state.phase = GamePhase.GAME;
            state.playerBoard = { ships: cleanShips, hits: {} };
            state.enemyBoard = generateInitialEnemyBoard();

            state.baselinePlayerShips = deepClone(cleanShips);
            state.winner = null;
            state.currentTurn = "player";
        },

        restartGame(state) {
            resetAIMemory();

            const src = state.baselinePlayerShips || [];
            const clean = normalizeShips(deepClone(src));

            state.playerBoard = {
                ships: clean,
                hits: {},
            };

            state.enemyBoard = generateInitialEnemyBoard();

            state.phase = GamePhase.GAME;
            state.currentTurn = "player";
            state.winner = null;
        },

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
            // ДОДАНО: скидання history
            state.history = [];
            state.currentRound = 1;
            localStorage.removeItem("battleship-score");
        },

        surrender(state) {
            state.winner = "enemy";
        },

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
            const latest = store.getState();

            if (
                latest.game.phase === GamePhase.GAME &&
                latest.game.currentTurn === "enemy" &&
                !latest.game.winner
            ) {
                store.dispatch(
                    gameSlice.actions.executeEnemyTurn({
                        settings: latest.settings,
                    })
                );
            }
        }, settings.enemyDelay || 1000);
    }

    return result;
};

export const {
    setPhase,
    setScore,
    addRoundToHistory,
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
