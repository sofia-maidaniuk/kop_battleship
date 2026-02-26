/**
 * @module Pages/Start
 * @description Стартова сторінка додатка "Морський бій".
 * Є початковою точкою входу для користувача, де він може обрати:
 * почати нову ігрову сесію або ознайомитися з правилами.
 */

import React from "react";
import styles from "./StartPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPhase } from "../store/gameSlice";

/**
 * Компонент StartPage.
 * * @component
 * @description Рендерить головне меню гри з логотипом та кнопками навігації.
 * Взаємодіє з Redux для синхронізації поточної фази гри перед зміною маршруту.
 * * @returns {JSX.Element} Стартовий екран із кнопками керування.
 */
export function StartPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    /**
     * Обробник натискання кнопки "Почати гру".
     * Встановлює фазу гри в "settings" та перенаправляє користувача на сторінку налаштувань.
     * @function handleStart
     */
    const handleStart = () => {
        dispatch(setPhase("settings"));
        navigate(`/user/${userId}/settings`);
    };

    /**
     * Обробник натискання кнопки "Правила гри".
     * Встановлює фазу гри в "rules" та перенаправляє користувача на відповідну сторінку.
     * @function handleRules
     */
    const handleRules = () => {
        dispatch(setPhase("rules"));
        navigate(`/user/${userId}/rules`);
    };

    return (
        <div className={styles.fullPage}>
            <h1 className={styles.title}>Морський бій</h1>

            {/*  */}

            <div className={styles.buttons}>
                <button className={styles.btn} onClick={handleStart}>
                    Почати гру
                </button>

                <button className={styles.btn} onClick={handleRules}>
                    Правила гри
                </button>
            </div>
        </div>
    );
}
