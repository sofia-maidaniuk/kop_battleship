/**
 * @module Pages/Rules
 * @description Сторінка з правилами гри "Морський бій".
 * Надає користувачеві інформацію про розмір ігрового поля, склад флоту
 * та правила розміщення кораблів.
 */

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RulesPage.module.css";

/**
 * Компонент сторінки правил.
 * * @component
 * @description Рендерить статичний перелік правил гри та кнопку повернення.
 * Використовує параметри маршруту для коректного повернення до сесії користувача.
 * * @returns {JSX.Element} Сторінка з маркованим списком правил.
 */
export function RulesPage() {
    const navigate = useNavigate();
    const { userId } = useParams();

    /**
     * Обробник натискання кнопки "Назад".
     * Повертає користувача на стартову сторінку, використовуючи його унікальний ID.
     * @function handleBack
     */
    const handleBack = () => {
        navigate(`/user/${userId}/start`);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Правила гри</h1>

            {/*  */}

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
