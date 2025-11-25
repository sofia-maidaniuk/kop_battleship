import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import gameReducer, { botTurnMiddleware } from "./gameSlice";

export const store = configureStore({
    reducer: {
        settings: settingsReducer,
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(botTurnMiddleware),
});
