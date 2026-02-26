/**
 * @module Pages/Results
 * @description Сторінка статистики та історії ігор.
 * Відображає загальний рахунок перемог/поразок та детальну таблицю минулих раундів.
 * Дозволяє користувачеві переглядати тривалість і складність кожної гри, а також скидати історію.
 */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ResultsPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { resetScore } from "../store/gameSlice";

/**
 * Компонент сторінки результатів.
 * * @component
 * @description Використовує Redux для отримання даних про рахунок та історію.
 * Реалізує форматування об'єктів історії (дати та тривалості) у зручний для читання табличний вигляд.
 * * @returns {JSX.Element} Рендерить таблицю результатів або повідомлення про порожню історію.
 */
export function ResultsPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    /** @type {Object} Отримання рахунку та масиву історії з Redux-стейту */
    const { score, history } = useSelector((state) => state.game);

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Таблиця результатів</h1>

            {/* Блок відображення загального рахунку */}
            <div className={styles.scoreBlock}>
                <div className={styles.scoreCard}>
                    <span>Перемоги:</span>
                    <strong>{score.wins}</strong>
                </div>
                <div className={styles.scoreCard}>
                    <span>Поразки:</span>
                    <strong>{score.losses}</strong>
                </div>
            </div>

            <h2 className={styles.subtitle}>Історія раундів</h2>

            {/* Умовний рендеринг: таблиця або заглушка "порожньо" */}
            {history.length === 0 ? (
                <p className={styles.empty}>Історія порожня — зіграйте кілька раундів.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Переможець</th>
                        <th>Тривалість</th>
                        <th>Складність</th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((row) => (
                        <tr key={row.timestamp}>
                            <td>{row.roundNumber}</td>
                            <td className={row.winner === "player" ? styles.player : styles.enemy}>
                                {row.winner === "player" ? "Гравець" : "Бот"}
                            </td>
                            {/* Форматування тривалості з секунд у хвилини/секунди */}
                            <td>{Math.floor(row.duration / 60)} хв {row.duration % 60} сек</td>
                            <td>{row.difficulty}</td>
                            {/* Перетворення timestamp у локальний формат дати та часу */}
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className={styles.buttons}>
                <button
                    className={styles.btn}
                    onClick={() => navigate(`/user/${userId}/start`)}
                >
                    На головну
                </button>

                <button
                    className={styles.btnReset}
                    onClick={() => dispatch(resetScore())}
                >
                    Очистити історію
                </button>
            </div>
        </div>
    );
}
