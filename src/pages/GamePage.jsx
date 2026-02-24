import React, { useState, useEffect } from "react";
import styles from "./GamePage.module.css";
import { Grid } from "../components/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useGameTimers } from "../hook/useGameTimers";
import { ResultModal } from "../components/ResultModal";
import { useNavigate, useParams } from "react-router-dom";
import {
    takeShot,
    restartGame,
    nextRound,
    resetScore,
    surrender,
    incrementWin,
    incrementLoss,
    addRoundToHistory
} from "../store/gameSlice";

export function GamePage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    const {
        currentTurn,
        playerBoard,
        enemyBoard,
        winner,
        score,
    } = useSelector((state) => state.game);

    const settings = useSelector((state) => state.settings);

    const isPlayerTurn = currentTurn === "player";

    const { formatTotalTime, formatTurnTime, getDurationForHistory } = useGameTimers();

    const [scoreUpdated, setScoreUpdated] = useState(false);
    const [historySaved, setHistorySaved] = useState(false);

    // ОНОВЛЕННЯ РАХУНКУ
    useEffect(() => {
        if (!winner) return;

        if (!scoreUpdated) {
            if (winner === "player") dispatch(incrementWin());
            else dispatch(incrementLoss());

            setScoreUpdated(true);
        }
    }, [winner, scoreUpdated, dispatch]);

    //ЗАПИС РАУНДУ В ІСТОРІЮ
    useEffect(() => {
        if (!winner) return;

        if (!historySaved) {
            const roundStats = {
                winner,
                duration: getDurationForHistory(), // Використовуємо правильну функцію
                difficulty: settings.difficulty,
            };

            dispatch(addRoundToHistory(roundStats));
            setHistorySaved(true);
        }
    }, [winner, historySaved, dispatch, settings, getDurationForHistory]);

    // СКИДАННЯ ФЛАГІВ НА НОВУ ГРУ
    useEffect(() => {
        if (!winner) {
            setScoreUpdated(false);
            setHistorySaved(false);
        }
    }, [winner]);

    const handleEnemyCellClick = (coord) => {
        if (!isPlayerTurn) return;
        if (enemyBoard.hits[coord]) return;

        dispatch(
            takeShot({
                coord,
                shooter: "player",
            })
        );
    };

    return (
        <div className={`${styles.page} full-page`}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>Морський бій</h1>
                <button
                    className={styles.surrenderBtn}
                    onClick={() => {
                        dispatch(surrender());
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
                <div
                    className={`${styles.playerLabel} ${
                        isPlayerTurn ? "active" : ""
                    }`}
                >
                    Player (Ваш хід)
                </div>

                <div
                    className={`${styles.turnArrow} ${
                        !isPlayerTurn ? styles.enemyArrow : ""
                    }`}
                >
                    ➡
                </div>

                <div
                    className={`${styles.enemyLabel} ${
                        !isPlayerTurn ? "active" : ""
                    }`}
                >
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
                    dispatch(restartGame());
                    navigate(`/user/${userId}/game`);
                }}
                onNextRound={() => {
                    dispatch(nextRound());
                    navigate(`/user/${userId}/placement`);
                }}
                onExit={() => {
                    dispatch(resetScore());
                    navigate(`/user/${userId}/start`);
                }}
                onViewResults={() => navigate(`/user/${userId}/results`)}
            />
        </div>
    );
}
