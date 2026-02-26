/**
 * @module Hooks/useGameTimers
 * @description Кастомний хук для керування часовими лімітами гри Battleship.
 * Забезпечує роботу загального таймера раунду та таймера ходу гравця.
 * Реалізує персистентність (збереження стану) через LocalStorage, щоб час не скидався при оновленні сторінки.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endPlayerTurn, surrender } from "../store/gameSlice";

/** @constant {string} Ключ LocalStorage для загального часу гри */
const LS_TOTAL = "battle_total_time";
/** @constant {string} Ключ LocalStorage для часу поточного ходу */
const LS_TURN = "battle_turn_time";
/** @constant {string} Ключ LocalStorage для мітки часу початку гри */
const LS_START_TIME = "battle_start_time";

/**
 * Хук useGameTimers.
 * * @function useGameTimers
 * @returns {Object} Об'єкт із часовими станами та методами форматування:
 * { turnTime, totalTime, formatTurnTime, formatTotalTime, getDurationForHistory, getElapsedTime }
 */
export function useGameTimers() {
    const dispatch = useDispatch();

    const settings = useSelector((state) => state.settings);
    const currentTurn = useSelector((state) => state.game.currentTurn);
    const winner = useSelector((state) => state.game.winner);
    const phase = useSelector((state) => state.game.phase);

    /** @type {Object} Референс для зберігання початкового налаштованого часу */
    const initialTotalTime = useRef(settings.totalTime * 60);

    /**
     * Допоміжна функція для завантаження числових значень зі сховища.
     * @param {string} key - Ключ у localStorage.
     * @param {number} fallback - Значення за замовчуванням.
     * @returns {number}
     */
    const loadNumber = (key, fallback) => {
        const saved = localStorage.getItem(key);
        return saved !== null ? Number(saved) : fallback;
    };

    /** Стейт загального залишку часу (в секундах). @type {Array} */
    const [totalTime, setTotalTime] = useState(
        loadNumber(LS_TOTAL, settings.totalTime * 60)
    );

    /** Стейт залишку часу на поточний хід (в секундах). @type {Array} */
    const [turnTime, setTurnTime] = useState(
        loadNumber(LS_TURN, settings.turnTimeLimit)
    );

    /**
     * Форматує секунди у рядок типу "MM:SS".
     * @param {number} seconds
     * @returns {string}
     */
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    /**
     * Розраховує кількість секунд, що пройшли з моменту старту гри.
     * @function getElapsedTime
     * @returns {number}
     */
    const getElapsedTime = useCallback(() => {
        const startTime = localStorage.getItem(LS_START_TIME);
        if (!startTime) return 0;
        const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        return elapsedSeconds;
    }, []);

    /**
     * Розраховує повну тривалість гри для запису в історію після завершення.
     * @function getDurationForHistory
     * @returns {number} Секунди тривалості гри.
     */
    const getDurationForHistory = useCallback(() => {
        if (!winner) return 0;
        const startTime = localStorage.getItem(LS_START_TIME);
        if (!startTime) return 0;
        const endTime = Date.now();
        const duration = Math.floor((endTime - parseInt(startTime)) / 1000);
        return duration;
    }, [winner]);

    /**
     * Ефект ініціалізації: встановлює мітку початку гри та початкові значення таймерів.
     */
    useEffect(() => {
        if (phase === "game" && !localStorage.getItem(LS_START_TIME)) {
            const startTime = Date.now();
            localStorage.setItem(LS_START_TIME, startTime.toString());
            initialTotalTime.current = settings.totalTime * 60;

            setTotalTime(settings.totalTime * 60);
            setTurnTime(settings.turnTimeLimit);

            localStorage.setItem(LS_TOTAL, (settings.totalTime * 60).toString());
            localStorage.setItem(LS_TURN, settings.turnTimeLimit.toString());
        }
    }, [phase, settings.totalTime, settings.turnTimeLimit]);

    /**
     * Ефект загального ігрового таймера.
     * При досягненні нуля викликає surrender (поразку).
     */
    useEffect(() => {
        if (winner) return;

        if (totalTime <= 0) {
            dispatch(surrender());
            return;
        }

        const totalTimer = setInterval(() => {
            setTotalTime((prev) => {
                const next = prev > 0 ? prev - 1 : 0;
                localStorage.setItem(LS_TOTAL, next.toString());
                return next;
            });
        }, 1000);

        return () => clearInterval(totalTimer);
    }, [totalTime, winner, dispatch]);

    /**
     * Ефект таймера ходу гравця.
     * При досягненні нуля автоматично передає хід ворогу.
     */
    useEffect(() => {
        if (winner) return;
        if (currentTurn !== "player") return;

        if (turnTime <= 0) {
            dispatch(endPlayerTurn());
            const resetValue = settings.turnTimeLimit;
            setTurnTime(resetValue);
            localStorage.setItem(LS_TURN, resetValue.toString());
            return;
        }

        const turnTimer = setInterval(() => {
            setTurnTime((prev) => {
                const next = prev > 0 ? prev - 1 : 0;
                localStorage.setItem(LS_TURN, next.toString());
                return next;
            });
        }, 1000);

        return () => clearInterval(turnTimer);
    }, [currentTurn, turnTime, winner, dispatch, settings.turnTimeLimit]);

    /**
     * Ефект скидання часу на хід при зміні активного гравця.
     */
    useEffect(() => {
        if (currentTurn === "player" && !winner) {
            const resetValue = settings.turnTimeLimit;
            setTurnTime(resetValue);
            localStorage.setItem(LS_TURN, resetValue.toString());
        }
    }, [currentTurn, settings.turnTimeLimit, winner]);

    /**
     * Очищення LocalStorage після визначення переможця.
     */
    useEffect(() => {
        if (winner) {
            // Використовуємо setTimeout для відкладеного очищення, щоб getDurationForHistory встиг спрацювати
            const timer = setTimeout(() => {
                localStorage.removeItem(LS_TOTAL);
                localStorage.removeItem(LS_TURN);
                localStorage.removeItem(LS_START_TIME);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [winner]);

    return {
        turnTime,
        totalTime,
        formatTurnTime: `${turnTime}s`,
        formatTotalTime: formatTime(totalTime),
        getDurationForHistory,
        getElapsedTime,
    };
}
