/**
 * @module Pages/Game
 * @description Основна сторінка ігрового процесу "Морський бій".
 * Координує взаємодію між гравцем та ШІ, відображає ігрові поля,
 * керує таймерами та обробляє завершення гри (запис результатів, оновлення рахунку).
 */

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

/**
 * Компонент сторінки гри.
 * * @component
 * @description Виконує роль контейнера для ігрової логіки:
 * - Слідкує за чергою ходів.
 * - Оновлює глобальний рахунок перемог/поразок.
 * - Зберігає статистику раундів в історію.
 * - Керує відображенням модального вікна результатів.
 * * @returns {JSX.Element} Рендерить ігровий інтерфейс із двома полями та панеллю приладів.
 */
export function GamePage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    /** @type {Object} Дані з ігрового стейту Redux */
    const {
        currentTurn,
        playerBoard,
        enemyBoard,
        winner,
        score,
    } = useSelector((state) => state.game);

    /** @type {Object} Налаштування складності та таймерів */
    const settings = useSelector((state) => state.settings);

    /** @type {boolean} Прапор, що вказує, чи зараз хід активного гравця */
    const isPlayerTurn = currentTurn === "player";

    /** Отримання форматованого часу та методів розрахунку тривалості з хука */
    const { formatTotalTime, formatTurnTime, getDurationForHistory } = useGameTimers();

    /** Стан для уникнення дублювання оновлення рахунку. @type {Array} */
    const [scoreUpdated, setScoreUpdated] = useState(false);
    /** Стан для уникнення дублювання запису в історію. @type {Array} */
    const [historySaved, setHistorySaved] = useState(false);

    /**
     * Ефект для оновлення рахунку перемог/поразок.
     * Спрацьовує один раз при визначенні переможця.
     */
    useEffect(() => {
        if (!winner) return;

        if (!scoreUpdated) {
            if (winner === "player") dispatch(incrementWin());
            else dispatch(incrementLoss());

            setScoreUpdated(true);
        }
    }, [winner, scoreUpdated, dispatch]);

    /**
     * Ефект для запису завершеного раунду в історію.
     * Розраховує тривалість гри та фіксує рівень складності.
     */
    useEffect(() => {
        if (!winner) return;

        if (!historySaved) {
            const roundStats = {
                winner,
                duration: getDurationForHistory(),
                difficulty: settings.difficulty,
            };

            dispatch(addRoundToHistory(roundStats));
            setHistorySaved(true);
        }
    }, [winner, historySaved, dispatch, settings, getDurationForHistory]);

    /**
     * Скидає локальні прапори оновлення при початку нового раунду (коли winner стає null).
     */
    useEffect(() => {
        if (!winner) {
            setScoreUpdated(false);
            setHistorySaved(false);
        }
    }, [winner]);

    /**
     * Обробник кліку по ворожому полю.
     * Виконує постріл гравця, якщо зараз його хід і клітинка ще не була атакована.
     * * @param {string} coord - Координата цілі (напр. "Б3").
     */
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

            {/* Панель таймерів */}
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

            {/* Індикатор черговості ходу */}
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

            {/* Ігрові поля */}
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

            {/* Модальне вікно фіналу */}
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
