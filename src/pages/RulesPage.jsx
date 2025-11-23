import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RulesPage.module.css";

export function RulesPage() {
    const navigate = useNavigate();
    const { userId } = useParams();

    const handleBack = () => {
        navigate(`/user/${userId}/start`);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Правила гри</h1>

            <ul className={styles.list}>
                <li>Поле розміром 5×5</li>
                <li>1 трипалубний, 1 двопалубний, 2 однопалубні кораблі</li>
                <li>Розташування лише по горизонталі або вертикалі</li>
                <li>Кораблі не можуть торкатися кутами чи бортами</li>
                <li>Перемагає той, хто першим потопить усі кораблі суперника</li>
            </ul>

            <button className={styles.btn} onClick={handleBack}>
                Назад
            </button>
        </div>
    );
}
