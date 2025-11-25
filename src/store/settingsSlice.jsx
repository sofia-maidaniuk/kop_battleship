import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "battleship-settings";

const defaultSettings = {
    difficulty: "easy",
    turnTimeLimit: 60,
    totalTime: 15,
    enemyDelay: 1200,
    aiMode: "random",
};

// Load from localStorage
function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return defaultSettings;

        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
    } catch {
        console.warn("Invalid settings in storage");
        return defaultSettings;
    }
}

const initialState = loadSettings();

// Helper to update based on difficulty
function applyDifficultyLogic(state) {
    if (state.difficulty === "easy") {
        state.turnTimeLimit = 60;
        state.totalTime = 15;
        state.enemyDelay = 1200;
        state.aiMode = "random";
    }

    if (state.difficulty === "medium") {
        state.turnTimeLimit = 40;
        state.totalTime = 12;
        state.enemyDelay = 800;
        state.aiMode = "target";
    }

    if (state.difficulty === "hard") {
        state.turnTimeLimit = 30;
        state.totalTime = 10;
        state.enemyDelay = 400;
        state.aiMode = "smart";
    }
}

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateSettings(state, action) {
            const updates = action.payload;

            // Оновлюємо state
            Object.assign(state, updates);

            // Перерахунок залежно від difficulty
            applyDifficultyLogic(state);

            // Збереження у localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        },

        resetSettings() {
            localStorage.removeItem(STORAGE_KEY);
            return defaultSettings;
        },
    },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
