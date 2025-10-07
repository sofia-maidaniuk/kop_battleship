import React from "react";
import "../styles/ResultPage.css";

export function ResultPage({ onBackToStart }) {
    return (
        <div className="result-page full-page">
            <h1>Гру завершено</h1>
            <p className="result-message">Ви здалися. Наступного разу пощастить більше!</p>
            <button className="btn" onClick={onBackToStart}>
                Повернутися на старт
            </button>
        </div>
    );
}
