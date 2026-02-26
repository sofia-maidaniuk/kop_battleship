/**
 * @module Store/GameSlice
 * @description Слайс Redux для керування станом гри "Морський бій".
 * Керує фазами гри, ходами гравців, ігровими полями, рахунком та історією раундів.
 */

import { createSlice } from "@reduxjs/toolkit";
import { generateAutoPlacement } from "../utils/shipUtils";
import { processShot } from "../utils/gameLogicUtils";
import { getEnemyShot, resetAIMemory } from "../utils/enemyLogic";

/**
 * Константи фаз гри.
 * @constant {Object}
 * @property {string} START - Екран привітання.
 * @property {string} SETTINGS - Екран налаштувань.
 * @property {string} PLACEMENT - Етап розстановки кораблів.
 * @property {string} GAME - Процес битви.
 * @property {string} RESULT - Фінальний екран з результатом.
 * @property {string} RULES - Сторінка з правилами гри.
 */
export const GamePhase = {
    START: "start",
    SETTINGS: "settings",
    PLACEMENT: "placement",
    GAME: "game",
    RESULT: "result",
    RULES: "rules",
};

/**
 * Створює глибоку копію об'єкта.
 * @param {Object} obj - Об'єкт для копіювання.
 * @returns {Object} Клонований об'єкт.
 */
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Скидає стан влучань для конкретного корабля.
 * @param {Object} ship - Об'єкт корабля.
 * @returns {Object} Корабель зі скинутим станом.
 */
const resetShipState = (ship) => ({
    ...ship,
    hits: [],
    isSunk: false,
});

/**
 * Нормалізує масив кораблів, скидаючи їх стан.
 * @param {Array} ships - Масив кораблів.
 * @returns {Array} Очищений масив кораблів.
 */
const normalizeShips = (ships) => (ships || []).map(resetShipState);

/**
 * Генерує початкове поле для ворога з випадковою розстановкою.
 * @returns {Object} Об'єкт поля: {ships, hits}.
 */
const generateInitialEnemyBoard = () => ({
    ships: normalizeShips(generateAutoPlacement()),
    hits: {},
});

/**
 * Повертає дефолтний стан ігрового слайсу.
 * @returns {Object} Початковий стан.
 */
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
        /** Змінює поточну фазу (екран) гри. */
        setPhase(state, action) {
            state.phase = action.payload;
        },

        /**
         * Додає запис про завершений раунд до історії.
         * @param {Object} action.payload - Дані раунду (час, тривалість тощо).
         */
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

        /** Встановлює значення рахунку (wins/losses). */
        setScore(state, action) {
            state.score = action.payload;
        },

        /**
         * Ініціалізує початок битви з вибраними кораблями гравця.
         * @param {Array} action.payload - Масив розставлених кораблів гравця.
         */
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

        /** Перезапускає гру з тією ж розстановкою кораблів гравця. */
        restartGame(state) {
            resetAIMemory();

            const src = state.baselinePlayerShips || [];
            const clean = normalizeShips(deepClone(src));
            state.playerBoard = { ships: clean, hits: {} };
            state.enemyBoard = generateInitialEnemyBoard();

            state.phase = GamePhase.GAME;
            state.currentTurn = "player";
            state.winner = null;
        },

        /**
         * Обробляє постріл (гравця або бота).
         * @param {Object} action.payload - {coord: string, shooter: 'player'|'enemy'}.
         */
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

        /** Передає право ходу ворогу. */
        endPlayerTurn(state) {
            state.currentTurn = "enemy";
        },

        /** Збільшує кількість перемог та зберігає в localStorage. */
        incrementWin(state) {
            state.score.wins += 1;
            localStorage.setItem("battleship-score", JSON.stringify(state.score));
        },

        /** Збільшує кількість поразок та зберігає в localStorage. */
        incrementLoss(state) {
            state.score.losses += 1;
            localStorage.setItem("battleship-score", JSON.stringify(state.score));
        },

        /** Готує стейт до наступного раунду (повернення на етап розстановки). */
        nextRound(state) {
            resetAIMemory();
            state.phase = GamePhase.PLACEMENT;
            state.currentTurn = "player";
            state.winner = null;
        },

        /** Повністю скидає рахунок, історію та очищує localStorage. */
        resetScore(state) {
            state.score = { wins: 0, losses: 0 };
            // скидання history
            state.history = [];
            state.currentRound = 1;
            localStorage.removeItem("battleship-score");
        },

        /** Дострокове завершення гри (поразка гравця). */
        surrender(state) {
            state.winner = "enemy";
        },

        /**
         * Виконує логіку ходу бота.
         * @param {Object} action.payload - {settings: Object}.
         */
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

/**
 * Middleware для автоматизації ходу бота.
 * Якщо зараз хід ворога, викликає затримку та ініціює executeEnemyTurn.
 * * @param {Object} store - Redux store.
 */
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
