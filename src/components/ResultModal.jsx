import ReactDOM from "react-dom";
import styles from "./ResultModal.module.css";

export function ResultModal({
                                winner,
                                score = { wins: 0, losses: 0 },
                                onRestart,
                                onNextRound,
                                onExit,
                                onViewResults
                            }) {
    if (!winner) return null;

    const message =
        winner === "player"
            ? "Вітаємо! Ви перемогли."
            : "Поразка... Спробуйте ще раз!";

    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.window}>
                <h2 className={styles.title}>{message}</h2>

                <p className={styles.score}>
                    Рахунок: {score.wins} : {score.losses}
                </p>

                <div className={styles.actions}>

                    {/* Новий блок: перейти до результатів */}
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
