import React from "react";
import styles from "./StartPage.module.css";
import { useNavigate, useParams } from "react-router-dom";

export function StartPage({ onStart, onShowRules }) {
    const navigate = useNavigate();
    const { userId } = useParams();

    const handleStart = () => {
        onStart();
        navigate(`/user/${userId}/settings`);
    };

    const handleRules = () => {
        onShowRules();
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
