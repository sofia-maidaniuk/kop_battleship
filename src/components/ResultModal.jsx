/**
 * @module Components/UI
 * @description Модальне вікно результатів гри.
 * Використовує React Portals для рендерингу поверх усього інтерфейсу додатку.
 * Відображає повідомлення про перемогу/поразку, поточний рахунок та надає навігаційні дії.
 */

import ReactDOM from "react-dom";
import styles from "./ResultModal.module.css";

/**
 * Компонент ResultModal.
 * * @component
 * @param {Object} props - Властивості компонента.
 * @param {('player'|'enemy'|null)} props.winner - Переможець матчу. Якщо null, модалка не рендериться.
 * @param {Object} [props.score={ wins: 0, losses: 0 }] - Поточний загальний рахунок сесії.
 * @param {number} props.score.wins - Кількість перемог гравця.
 * @param {number} props.score.losses - Кількість перемог бота.
 * @param {Function} props.onRestart - Функція для перезапуску поточного матчу з тими ж кораблями.
 * @param {Function} props.onNextRound - Функція для переходу до нового раунду (нова розстановка).
 * @param {Function} props.onExit - Функція для виходу в головне меню.
 * @param {Function} props.onViewResults - Функція для переходу на сторінку детальної історії раундів.
 * * @returns {React.ReactPortal|null} Рендерить портал у DOM-вузол "portal-root" або null.
 */
export function ResultModal({
                                winner,
                                score = { wins: 0, losses: 0 },
                                onRestart,
                                onNextRound,
                                onExit,
                                onViewResults
                            }) {
    if (!winner) return null;

    /** @type {string} Динамічне повідомлення залежно від результату */
    const message =
        winner === "player"
            ? "Вітаємо! Ви перемогли."
            : "Поразка... Спробуйте ще раз!";

    // Використання порталу для забезпечення коректного відображення поверх overlay
    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.window}>
                <h2 className={styles.title}>{message}</h2>

                <p className={styles.score}>
                    Рахунок: {score.wins} : {score.losses}
                </p>

                <div className={styles.actions}>
                    <button
                        className={`${styles.btn} ${styles.results}`}
                        onClick={onViewResults}
                    >
                        Результати
                    </button>

                    <button
                        className={`${styles.btn} ${styles.primary}`}
                        onClick={onRestart}
                    >
                        Почати заново
                    </button>

                    <button
                        className={`${styles.btn} ${styles.secondary}`}
                        onClick={onNextRound}
                    >
                        Наступний тур
                    </button>

                    <button
                        className={`${styles.btn} ${styles.exit}`}
                        onClick={onExit}
                    >
                        Вийти
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("portal-root")
    );
}
