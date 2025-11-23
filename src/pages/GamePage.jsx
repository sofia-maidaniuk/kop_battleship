import React from "react";
import "./GamePage.css";
import { Grid } from "../components/Grid";
import { useSettings } from "../context/SettingsContext";
import { useGameTimers } from "../hook/useGameTimers";
import { ResultModal } from "../components/ResultModal";

export function GamePage({
                             onSurrender, //функція переходу
                             currentTurn, // 'player' або 'enemy'
                             playerBoard, // { ships, hits } гравця
                             enemyBoard,  // { ships, hits } ворога
                             actions,// { takeShot }
                             winner,
                             score
                         }) {
    const isPlayerTurn = currentTurn === "player";
    const { settings } = useSettings();
    const { formatTotalTime, formatTurnTime } = useGameTimers(currentTurn, actions, settings);

    const handleEnemyCellClick = (coord) => {
        if (!isPlayerTurn) return;
        if (enemyBoard.hits[coord]) return;
        actions.takeShot(coord, "player");
    };

    return (
        <div className="game-page full-page">
            <div className="top-bar">
                <h1>Морський бій</h1>
                <button className="btn" onClick={onSurrender}>
                    Здатися
                </button>
            </div>

            <div className="time-panel">
                <div className="total-timer">
                    Загальний час: <strong>{formatTotalTime}</strong>
                </div>
                <div className="turn-timer">
                    Час на хід: <strong>{formatTurnTime}</strong>
                </div>
            </div>

            <div className="turn-indicator">
                <div className={`player-label ${isPlayerTurn ? "active" : ""}`}>
                    Player (Ваш хід)
                </div>
                <div className={`turn-arrow ${!isPlayerTurn ? "enemy-turn-arrow" : ""}`}>➡</div>
                <div className={`enemy-label ${!isPlayerTurn ? "active" : ""}`}>
                    Enemy (Хід бота)
                </div>
            </div>

            <div className="boards-container">
                <div className="board-section">
                    <h2>Моє поле</h2>
                    <Grid
                        ships={playerBoard.ships}
                        showShips={true}
                        isEnemy={false}
                        cellStates={playerBoard.hits}
                    />
                </div>

                <div className="board-section">
                    <h2>Вороже поле</h2>
                    <Grid
                        ships={enemyBoard.ships}
                        showShips={false}
                        isEnemy={true}
                        cellStates={enemyBoard.hits}
                        onCellClick={handleEnemyCellClick}
                    />
                </div>
            </div>

            <ResultModal
                winner={winner}
                score={score}
                onRestart={() => {
                    actions.restartGame();
                }}
                onNextRound={() => {
                    actions.nextRound();
                }}
                onExit={() => {
                    actions.resetScore();
                    actions.hideRules();
                }}
            />
        </div>
    );
}
