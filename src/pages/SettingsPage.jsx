import React from "react";
import styles from "./SettingsPage.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../store/settingsSlice";

const schema = yup.object().shape({
    difficulty: yup
        .string()
        .oneOf(["easy", "medium", "hard"], "Оберіть рівень складності")
        .required("Рівень складності обов’язковий"),
});

export function SettingsPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    const settings = useSelector((state) => state.settings);

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

    const onSubmit = (data) => {
        dispatch(updateSettings({ difficulty: data.difficulty }));
        navigate(`/user/${userId}/placement`);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Налаштування гри</h1>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.info}>
                    <p>
                        Оберіть рівень складності — час на хід, загальний час гри
                        та логіка бота підберуться автоматично.
                    </p>
                </div>

                <div className={styles.formGroup}>
                    <label>Рівень складності:</label>
                    <select {...register("difficulty")}>
                        <option value="">-- Оберіть рівень --</option>
                        <option value="easy">Легкий</option>
                        <option value="medium">Середній</option>
                        <option value="hard">Важкий</option>
                    </select>

                    {errors.difficulty && (
                        <p className={styles.error}>{errors.difficulty.message}</p>
                    )}
                </div>

                {selectedDifficulty && (
                    <div className={styles.summary}>
                        {selectedDifficulty === "easy" && (
                            <ul className={styles.easy}>
                                <li>Час на хід: 60 секунд</li>
                                <li>Загальний час гри: 15 хвилин</li>
                                <li>Бот стріляє випадково</li>
                            </ul>
                        )}
                        {selectedDifficulty === "medium" && (
                            <ul className={styles.medium}>
                                <li>Час на хід: 40 секунд</li>
                                <li>Загальний час гри: 12 хвилин</li>
                                <li>Бот добиває кораблі після влучання</li>
                            </ul>
                        )}
                        {selectedDifficulty === "hard" && (
                            <ul className={styles.hard}>
                                <li>Час на хід: 30 секунд</li>
                                <li>Загальний час гри: 10 хвилин</li>
                                <li>Бот уникає клітинок біля потоплених кораблів</li>
                            </ul>
                        )}
                    </div>
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={() => navigate(`/user/${userId}/start`)}
                    >
                        Назад
                    </button>

                    <button type="submit" className={styles.btnPrimary}>
                        Почати гру
                    </button>
                </div>
            </form>
        </div>
    );
}
