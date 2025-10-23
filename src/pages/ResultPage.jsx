import React from "react";
import "../styles/ResultPage.css";

export function ResultPage({ onBackToStart, winner }) {

    let title;
    let message;

    if (winner === 'player') {
        title = "Перемога!";
        message = "Вітаємо! Ви знищили флот суперника.";
    } else if (winner === 'enemy') {
        title = "Поразка";
        message = "На жаль, ваш флот потоплено. Наступного разу пощастить більше!";
    } else {
        title = "Гру завершено";
        message = "Гра завершена. Натисніть кнопку, щоб розпочати знову.";
    }

    return (
        <div className="result-page full-page">
            <h1>{title}</h1>
            <p className="result-message">{message}</p>
            <button className="btn" onClick={onBackToStart}>
                Повернутися на старт
            </button>
        </div>
    );
}
