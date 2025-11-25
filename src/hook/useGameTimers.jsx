import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endPlayerTurn, surrender } from "../store/gameSlice";

export function useGameTimers() {
    const dispatch = useDispatch();

    const settings = useSelector((state) => state.settings);
    const currentTurn = useSelector((state) => state.game.currentTurn);
    const winner = useSelector((state) => state.game.winner);

    const [totalTime, setTotalTime] = useState(settings.totalTime * 60);
    const [turnTime, setTurnTime] = useState(settings.turnTimeLimit);

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
            setTotalTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(totalTimer);
    }, [totalTime, winner, dispatch]);

    //Таймер ходу (оновлюється кожну секунду)
    useEffect(() => {
        if (winner) return;
        if (currentTurn !== "player") return;

        if (turnTime <= 0) {
            dispatch(endPlayerTurn());
            setTurnTime(settings.turnTimeLimit);
            return;
        }

        const turnTimer = setInterval(() => {
            setTurnTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(turnTimer);
    }, [currentTurn, turnTime, winner, dispatch, settings.turnTimeLimit]);

    // Скидання часу на хід при зміні черги
    useEffect(() => {
        if (currentTurn === "player" && !winner) {
            setTurnTime(settings.turnTimeLimit);
        }
    }, [currentTurn, settings.turnTimeLimit, winner]);

    return {
        turnTime,
        totalTime,
        formatTurnTime: `${turnTime}s`,
        formatTotalTime: formatTime(totalTime),
    };
}
