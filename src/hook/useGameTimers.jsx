import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endPlayerTurn, surrender } from "../store/gameSlice";

const LS_TOTAL = "battle_total_time";
const LS_TURN = "battle_turn_time";

export function useGameTimers() {
    const dispatch = useDispatch();

    const settings = useSelector((state) => state.settings);
    const currentTurn = useSelector((state) => state.game.currentTurn);
    const winner = useSelector((state) => state.game.winner);

    // відновлення часу гри
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
                localStorage.setItem(LS_TOTAL, next);
                return next;
            });
        }, 1000);

        return () => clearInterval(totalTimer);
    }, [totalTime, winner, dispatch]);

    //Таймер ходу (оновлюється кожну секунду)
    useEffect(() => {
        if (winner) return;
        if (currentTurn !== "player") return;

        if (turnTime <= 0) {
            dispatch(endPlayerTurn());
            const resetValue = settings.turnTimeLimit;
            setTurnTime(resetValue);
            localStorage.setItem(LS_TURN, resetValue);
            return;
        }

        const turnTimer = setInterval(() => {
            setTurnTime((prev) => {
                const next = prev > 0 ? prev - 1 : 0;
                localStorage.setItem(LS_TURN, next);
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
            localStorage.setItem(LS_TURN, resetValue);
        }
    }, [currentTurn, settings.turnTimeLimit, winner]);

    return {
        turnTime,
        totalTime,
        formatTurnTime: `${turnTime}s`,
        formatTotalTime: formatTime(totalTime),
    };
}
