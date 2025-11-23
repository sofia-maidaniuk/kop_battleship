import ReactDOM from "react-dom";
import "./ResultModal.css";

export function ResultModal({ winner, score = { wins: 0, losses: 0 }, onRestart, onNextRound, onExit }) {
    if (!winner) return null;

    const message =
        winner === "player"
            ? "Вітаємо! Ви перемогли."
            : "Поразка... Спробуйте ще раз!";

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-window">
                <h2 className="modal-title">{message}</h2>
                <p className="score">
                    Рахунок: {score.wins} : {score.losses}
                </p>
                <div className="modal-actions">
                    <button className="btn btn-primary" onClick={onRestart}>
                        Почати заново
                    </button>
                    <button className="btn btn-secondary" onClick={onNextRound}>
                        Наступний тур
                    </button>
                    <button className="btn btn-exit" onClick={onExit}>
                        Вийти
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("portal-root")
    );
}

