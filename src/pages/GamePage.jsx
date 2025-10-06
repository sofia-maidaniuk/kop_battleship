import React from "react";
import "./styles/GamePage.css";
import { Grid } from "../components/Grid";

export function GamePage() {
    // Флот
    const myFleet = [
        ["А5"],
        ["В4"],
        ["А2", "Б2", "В2"],
        ["Д4", "Д5"],
    ];

    // Флот ворога
    const enemyFleet = [
        ["Б1"],
        ["Д3"],
        ["В5", "Г5", "Д5"],
        ["А5", "А4"],
    ];

    return (
        <div className="game-page">
            <div className="board-section">
                <h2>Моє поле</h2>
                <Grid ships={myFleet} />
            </div>

            <div className="board-section">
                <h2>Вороже поле</h2>
                <Grid ships={enemyFleet} />
            </div>
        </div>
    );
}
