/**
 * @module Store/SettingsSlice
 * @description Слайс Redux для керування налаштуваннями гри.
 * Відповідає за вибір складності, ліміти часу на хід, загальний час раунду та інтелект бота.
 * Дані синхронізуються з localStorage для збереження між сесіями.
 */

import { createSlice } from "@reduxjs/toolkit";

/** @constant {string} Ключ для збереження налаштувань у локальному сховищі браузера */
const STORAGE_KEY = "battleship-settings";

/** * Налаштування за замовчуванням (рівень Easy).
 * @type {Object}
 * @property {string} difficulty - Назва рівня складності.
 * @property {number} turnTimeLimit - Час на один хід (у секундах).
 * @property {number} totalTime - Загальний ліміт часу на гру (у хвилинах).
 * @property {number} enemyDelay - Затримка перед ходом бота (у мс).
 * @property {string} aiMode - Режим інтелекту бота (random, target, smart).
 */
const defaultSettings = {
    difficulty: "easy",
    turnTimeLimit: 60,
    totalTime: 15,      // хвилин
    enemyDelay: 1200,   // мс
    aiMode: "random",
};

/**
 * Допоміжна функція, що застосовує пресети параметрів залежно від обраного рівня складності.
 * * @function applyDifficulty
 * @param {Object} base - Поточний об'єкт налаштувань.
 * @returns {Object} Оновлений об'єкт налаштувань згідно з обраною складністю.
 */
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

/**
 * Завантажує налаштування з localStorage або повертає дефолтні, якщо сховище порожнє.
 * * @function loadInitialSettings
 * @returns {Object} Початкові налаштування для стейту.
 */
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
        /**
         * Оновлює налаштування гри та зберігає їх у localStorage.
         * * @param {Object} action.payload - Об'єкт із новими значеннями налаштувань.
         */
        updateSettings(state, action) {
            const merged = { ...state, ...action.payload };
            const finalSettings = applyDifficulty(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalSettings));
            return finalSettings;
        },

        /**
         * Скидає налаштування до початкових та видаляє запис із localStorage.
         */
        resetSettings() {
            localStorage.removeItem(STORAGE_KEY);
            return defaultSettings;
        },
    },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
