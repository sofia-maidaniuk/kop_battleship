import React, { useState } from "react";
import "../styles/GamePage.css";
import { Grid } from "../components/Grid";

export function GamePage({ onSurrender }) {
    const [currentTurn] = useState("player"); // "player" або "enemy"
    // Флот (тимчасово — статичний)
    const myFleet = [
        ["А5"],
        ["В4"],
        ["А2", "Б2", "В2"],
        ["Д4", "Д5"],
    ];

    const enemyFleet = [
        ["Б1"],
        ["Д3"],
        ["В5", "Г5", "Д5"],
        ["А5", "А4"],
    ];

    return (
        <div className="game-page full-page">
            <div className="top-bar">
                <h1>Морський бій</h1>
                <button className="btn" onClick={onSurrender}>
                    Здатися
                </button>
            </div>

            <div className="turn-indicator">
                <div className={`player-label ${currentTurn === "player" ? "active" : ""}`}>
                    Player
                </div>
                <div className="turn-arrow">➡</div>
                <div className={`enemy-label ${currentTurn === "enemy" ? "active" : ""}`}>
                    Enemy
                </div>
            </div>


            {/* Ігрові поля */}
            <div className="boards-container">
                <div className="board-section">
                    <h2>Моє поле</h2>
                    <Grid ships={myFleet} />
                </div>

                <div className="board-section">
                    <h2>Вороже поле</h2>
                    <Grid ships={enemyFleet} />
                </div>
            </div>
        </div>
    );
}
