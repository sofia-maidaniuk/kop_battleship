import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import gameReducer, { botTurnMiddleware } from "./gameSlice";

const GAME_STORAGE_KEY = "battleship-game-state";

// Завантаження стану гри з localStorage
function loadGameState() {
    try {
        const saved = localStorage.getItem(GAME_STORAGE_KEY);
        if (!saved) return undefined;

        const parsedState = JSON.parse(saved);

        // ДОДАНО: переконатися, що history існує в завантаженому стані
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

// Middleware для збереження стану гри
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

// Створення Redux Store
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
