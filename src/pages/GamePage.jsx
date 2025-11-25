import React from "react";
import styles from "./GamePage.module.css";
import { Grid } from "../components/Grid";
import { useSelector } from "react-redux";
import { useGameTimers } from "../hook/useGameTimers";
import { ResultModal } from "../components/ResultModal";
import { useNavigate, useParams } from "react-router-dom";

export function GamePage({
                             onSurrender,
                             currentTurn,
                             playerBoard,
                             enemyBoard,
                             actions,
                             winner,
                             score
                         }) {
    const { userId } = useParams();
    const navigate = useNavigate();

    const isPlayerTurn = currentTurn === "player";

    // беремо settings з Redux
    const settings = useSelector((state) => state.settings);

    const { formatTotalTime, formatTurnTime } = useGameTimers(
        currentTurn,
        actions,
        settings
    );

    const handleEnemyCellClick = (coord) => {
        if (!isPlayerTurn) return;
        if (enemyBoard.hits[coord]) return;
        actions.takeShot(coord, "player");
    };

    return (
        <div className={`${styles.page} full-page`}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>Морський бій</h1>
                <button
                    className={styles.surrenderBtn}
                    onClick={() => {
                        onSurrender();
                        navigate(`/user/${userId}/start`);
                    }}
                >
                    Здатися
                </button>
            </div>

            <div className={styles.timePanel}>
                <div className={styles.timerCard}>
                    <div className={styles.timerLabel}>Загальний час</div>
                    <div className={styles.timerValue}>{formatTotalTime}</div>
                </div>

                <div className={styles.timerCard}>
                    <div className={styles.timerLabel}>Час на хід</div>
                    <div className={styles.timerValue}>{formatTurnTime}</div>
                </div>
            </div>

            <div className={styles.turnIndicator}>
                <div className={`${styles.playerLabel} ${isPlayerTurn ? "active" : ""}`}>
                    Player (Ваш хід)
                </div>

                <div className={`${styles.turnArrow} ${!isPlayerTurn ? styles.enemyArrow : ""}`}>
                    ➡
                </div>

                <div className={`${styles.enemyLabel} ${!isPlayerTurn ? "active" : ""}`}>
                    Enemy (Хід бота)
                </div>
            </div>

            <div className={styles.boardsContainer}>
                <div className={styles.boardSection}>
                    <h2>Моє поле</h2>
                    <Grid
                        ships={playerBoard.ships}
                        showShips={true}
                        isEnemy={false}
                        cellStates={playerBoard.hits}
                    />
                </div>

                <div className={styles.boardSection}>
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
                    navigate(`/user/${userId}/game`);
                }}
                onNextRound={() => {
                    actions.nextRound();
                    navigate(`/user/${userId}/placement`);
                }}
                onExit={() => {
                    actions.resetScore();
                    navigate(`/user/${userId}/start`);
                }}
            />
        </div>
    );
}
