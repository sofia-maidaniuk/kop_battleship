import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endPlayerTurn, surrender } from "../store/gameSlice";

const LS_TOTAL = "battle_total_time";
const LS_TURN = "battle_turn_time";
const LS_START_TIME = "battle_start_time";

export function useGameTimers() {
    const dispatch = useDispatch();

    const settings = useSelector((state) => state.settings);
    const currentTurn = useSelector((state) => state.game.currentTurn);
    const winner = useSelector((state) => state.game.winner);
    const phase = useSelector((state) => state.game.phase);

    const initialTotalTime = useRef(settings.totalTime * 60);

    const loadNumber = (key, fallback) => {
        const saved = localStorage.getItem(key);
        return saved !== null ? Number(saved) : fallback;
    };

    const [totalTime, setTotalTime] = useState(
        loadNumber(LS_TOTAL, settings.totalTime * 60)
    );

    const [turnTime, setTurnTime] = useState(
        loadNumber(LS_TURN, settings.turnTimeLimit)
    );

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Функція для отримання витраченого часу
    const getElapsedTime = useCallback(() => {
        const startTime = localStorage.getItem(LS_START_TIME);
        if (!startTime) return 0;
        const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        return elapsedSeconds;
    }, []);

    // Функція для отримання витраченого часу для історії
    const getDurationForHistory = useCallback(() => {
        if (!winner) return 0;
        const startTime = localStorage.getItem(LS_START_TIME);
        if (!startTime) return 0;
        const endTime = Date.now();
        const duration = Math.floor((endTime - parseInt(startTime)) / 1000);
        return duration;
    }, [winner]);

    // Ініціалізація часу при початку гри
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

    // Загальний таймер гри
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

    // Таймер ходу
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

    // Скидання часу на хід при зміні черги
    useEffect(() => {
        if (currentTurn === "player" && !winner) {
            const resetValue = settings.turnTimeLimit;
            setTurnTime(resetValue);
            localStorage.setItem(LS_TURN, resetValue.toString());
        }
    }, [currentTurn, settings.turnTimeLimit, winner]);

    // Очищення часу при завершенні раунду
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
