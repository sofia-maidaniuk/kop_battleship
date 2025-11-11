import { useState, useEffect } from "react";

const STORAGE_KEY = "battleship-settings";

const defaultSettings = {
    difficulty: "easy",
    turnTimeLimit: 60,
    totalTime: 15,
    enemyDelay: 1200,
    aiMode: "random" // логіка поведінки бота
};

export function useSettingsState() {
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings({ ...defaultSettings, ...parsed });
            } catch {
                console.warn("Invalid settings in storage, using defaults");
            }
        }
    }, []);

    const updateSettings = (next) => {
        setSettings((prev) => {
            const newSettings = typeof next === "function" ? next(prev) : next;

            // Перерахунок залежно від складності
            let difficultyConfig = {};
            switch (newSettings.difficulty) {
                case "easy":
                    difficultyConfig = {
                        turnTimeLimit: 60,
                        totalTime: 15,
                        enemyDelay: 1200,
                        aiMode: "random"
                    };
                    break;
                case "medium":
                    difficultyConfig = {
                        turnTimeLimit: 40,
                        totalTime: 12,
                        enemyDelay: 800,
                        aiMode: "target"
                    };
                    break;
                case "hard":
                    difficultyConfig = {
                        turnTimeLimit: 30,
                        totalTime: 10,
                        enemyDelay: 400,
                        aiMode: "smart"
                    };
                    break;
                default:
                    difficultyConfig = defaultSettings;
            }

            const finalSettings = { ...newSettings, ...difficultyConfig };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalSettings));
            return finalSettings;
        });
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem(STORAGE_KEY);
    };

    return { settings, updateSettings, resetSettings, defaultSettings };
}
