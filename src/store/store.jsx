/**
 * @module Store/Main
 * @description Конфігурація Redux Store для гри "Морський бій".
 * Об'єднує редьюсери, налаштовує Middleware для логіки бота та забезпечує
 * автоматичну синхронізацію стану гри з LocalStorage.
 */

import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import gameReducer, { botTurnMiddleware } from "./gameSlice";

/** @constant {string} Ключ, за яким стан гри зберігається в LocalStorage */
const GAME_STORAGE_KEY = "battleship-game-state";

/**
 * Завантажує збережений стан гри з LocalStorage.
 * Виконує перевірку наявності необхідних полів (history, currentRound) для забезпечення
 * зворотної сумісності даних.
 * * @function loadGameState
 * @returns {Object|undefined} Повертає об'єкт стану або undefined, якщо дані відсутні або пошкоджені.
 */
function loadGameState() {
    try {
        const saved = localStorage.getItem(GAME_STORAGE_KEY);
        if (!saved) return undefined;

        const parsedState = JSON.parse(saved);

        // Перевірка та ініціалізація обов'язкових полів історії для уникнення помилок рендерингу
        if (parsedState.game && !parsedState.game.history) {
            parsedState.game.history = [];
        }
        if (parsedState.game && typeof parsedState.game.currentRound !== 'number') {
            parsedState.game.currentRound = 1;
        }

        return parsedState;
    } catch {
        console.warn("Не вдалося завантажити стан гри");
        return undefined;
    }
}

/**
 * Middleware для автоматичного збереження стану гри.
 * Після кожної успішної дії (action) серіалізує поточний стан у JSON та записує в LocalStorage.
 * * @param {Object} store - Redux Store.
 */
const saveGameStateMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    try {
        const state = store.getState();

        const gameState = {
            game: state.game,
            settings: state.settings,
        };

        localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameState));
    } catch {
        console.warn("Не вдалося зберегти стан гри");
    }

    return result;
};

/**
 * Головний об'єкт Redux Store.
 * @constant {Object} store
 * * Конфігурація включає:
 * - Reducers: керування ігровою логікою та налаштуваннями.
 * - Preloaded State: відновлення сесії з LocalStorage.
 * - Middleware: логіка ШІ (botTurnMiddleware) та персистентність (saveGameStateMiddleware).
 */
export const store = configureStore({
    reducer: {
        settings: settingsReducer,
        game: gameReducer,
    },
    preloadedState: loadGameState(),

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            botTurnMiddleware,
            saveGameStateMiddleware
        ),
});
