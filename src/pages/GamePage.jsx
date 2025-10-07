import React, { useState } from "react";
import "../styles/GamePage.css";
import { Grid } from "../components/Grid";
import { createShip } from "../utils/shipUtils";

export function GamePage({ onSurrender }) {
    const [currentTurn] = useState("player"); // "player" або "enemy"

    const myFleet = [
        createShip(["А5"], "horizontal", 1),
        createShip(["В4"], "horizontal", 1),
        createShip(["А2", "Б2", "В2"], "vertical", 3),
        createShip(["Д4", "Д5"], "horizontal", 2),
    ];

    const enemyFleet = [
        createShip(["Б1"], "horizontal", 1),
        createShip(["Д3"], "horizontal", 1),
        createShip(["В5", "Г5", "Д5"], "horizontal", 3),
        createShip(["А5", "А4"], "vertical", 2),
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
                    {/* показуємо свої кораблі */}
                    <Grid ships={myFleet} showShips={true} isEnemy={false} />
                </div>

                <div className="board-section">
                    <h2>Вороже поле</h2>
                    {/* кораблі ворога приховані */}
                    <Grid ships={enemyFleet} showShips={false} isEnemy={true} />
                </div>
            </div>
        </div>
    );
}
