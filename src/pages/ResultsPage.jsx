import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ResultsPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { resetScore } from "../store/gameSlice";

export function ResultsPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    const { score, history } = useSelector((state) => state.game);

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Таблиця результатів</h1>

            {/* Загальний рахунок */}
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

            {/* Історія раундів */}
            <h2 className={styles.subtitle}>Історія раундів</h2>

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
                            <td>{Math.floor(row.duration / 60)} хв {row.duration % 60} сек</td>
                            <td>{row.difficulty}</td>
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
