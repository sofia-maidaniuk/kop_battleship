import React from "react";
import { useSettings } from "../context/SettingsContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./SettingsPage.css";

// Схема валідації
const schema = yup.object().shape({
    difficulty: yup
        .string()
        .oneOf(["easy", "medium", "hard"], "Оберіть рівень складності")
        .required("Рівень складності обов’язковий"),
});

export function SettingsPage({ onStart, onBack }) {
    const { settings, updateSettings } = useSettings();

    // Ініціалізація форми
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            difficulty: settings.difficulty,
        },
    });

    const selectedDifficulty = watch("difficulty");

    // Обробка сабміту
    const onSubmit = (data) => {
        updateSettings({ ...settings, difficulty: data.difficulty });
        if (onStart) onStart();
    };

    return (
        <div className="settings-page full-page">
            <h1>Налаштування гри</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
                <div className="settings-info">
                    <p>
                        Оберіть рівень складності — час на хід, загальний час гри та логіка бота
                        підберуться автоматично.
                    </p>
                </div>

                <div className="form-group">
                    <label>Рівень складності:</label>
                    <select {...register("difficulty")}>
                        <option value="">-- Оберіть рівень --</option>
                        <option value="easy">Легкий</option>
                        <option value="medium">Середній</option>
                        <option value="hard">Важкий</option>
                    </select>
                    {errors.difficulty && (
                        <p className="error-message">{errors.difficulty.message}</p>
                    )}
                </div>

                {selectedDifficulty && (
                    <div className="difficulty-summary">
                        {selectedDifficulty === "easy" && (
                            <ul className="easy">
                                <li>Час на хід: 60 секунд</li>
                                <li>Загальний час гри: 15 хвилин</li>
                                <li>Бот стріляє випадково</li>
                            </ul>
                        )}
                        {selectedDifficulty === "medium" && (
                            <ul className="medium">
                                <li>Час на хід: 40 секунд</li>
                                <li>Загальний час гри: 12 хвилин</li>
                                <li>Бот добиває кораблі після влучання</li>
                            </ul>
                        )}
                        {selectedDifficulty === "hard" && (
                            <ul className="hard">
                                <li>Час на хід: 30 секунд</li>
                                <li>Загальний час гри: 10 хвилин</li>
                                <li>Бот уникає клітинок біля потоплених кораблів</li>
                            </ul>
                        )}
                    </div>
                )}

                <div className="form-buttons">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onBack}
                    >
                        Назад
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Почати гру
                    </button>
                </div>
            </form>
        </div>
    );
}
