import React from "react";
import styles from "./StartPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPhase } from "../store/gameSlice";

export function StartPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    const handleStart = () => {
        // Перехід на сторінку налаштувань
        dispatch(setPhase("settings"));
        navigate(`/user/${userId}/settings`);
    };

    const handleRules = () => {
        // Перехід на сторінку правил
        dispatch(setPhase("rules"));
        navigate(`/user/${userId}/rules`);
    };

    return (
        <div className={styles.fullPage}>
            <h1 className={styles.title}>Морський бій</h1>

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
