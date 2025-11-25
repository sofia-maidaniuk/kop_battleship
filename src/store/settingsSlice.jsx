import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "battleship-settings";

const defaultSettings = {
    difficulty: "easy",
    turnTimeLimit: 60,
    totalTime: 15,      // хвилин
    enemyDelay: 1200,   // мс
    aiMode: "random",
};

function applyDifficulty(base) {
    switch (base.difficulty) {
        case "easy":
            return {
                ...base,
                turnTimeLimit: 60,
                totalTime: 15,
                enemyDelay: 1200,
                aiMode: "random",
            };
        case "medium":
            return {
                ...base,
                turnTimeLimit: 40,
                totalTime: 12,
                enemyDelay: 800,
                aiMode: "target",
            };
        case "hard":
            return {
                ...base,
                turnTimeLimit: 30,
                totalTime: 10,
                enemyDelay: 400,
                aiMode: "smart",
            };
        default:
            return { ...defaultSettings };
    }
}

function loadInitialSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultSettings;
    try {
        const parsed = JSON.parse(saved);
        return applyDifficulty({ ...defaultSettings, ...parsed });
    } catch {
        console.warn("Invalid settings in storage, using defaults");
        return defaultSettings;
    }
}

const settingsSlice = createSlice({
    name: "settings",
    initialState: loadInitialSettings(),
    reducers: {
        updateSettings(state, action) {
            const merged = { ...state, ...action.payload };
            const finalSettings = applyDifficulty(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalSettings));
            return finalSettings;
        },
        resetSettings() {
            localStorage.removeItem(STORAGE_KEY);
            return defaultSettings;
        },
    },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
