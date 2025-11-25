import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import gameReducer, { botTurnMiddleware } from "./gameSlice";

const GAME_STORAGE_KEY = "battleship-game-state";

// Завантаження даних гри
function loadGameState() {
    try {
        const saved = localStorage.getItem(GAME_STORAGE_KEY);
        if (!saved) return undefined; // нехай Redux створює початковий state

        return JSON.parse(saved);
    } catch (e) {
        console.warn("Не вдалося завантажити стан гри");
        return undefined;
    }
}

// Збереження гри після кожної зміни store
const saveGameStateMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    try {
        const state = store.getState();
        const gameState = {
            game: state.game,
            settings: state.settings,
        };

        localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
        console.warn("Не вдалося зберегти стан гри", e);
    }

    return result;
};

// Створення store з початковим станом (game + settings)
export const store = configureStore({
    reducer: {
        settings: settingsReducer,
        game: gameReducer,
    },
    preloadedState: loadGameState(),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(botTurnMiddleware, saveGameStateMiddleware),
});
