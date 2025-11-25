import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endPlayerTurn, surrender } from "../store/gameSlice";

export function useGameTimers(currentTurn) {
    const dispatch = useDispatch();

    // беремо налаштування з Redux
    const settings = useSelector((state) => state.settings);

    // Загальний час гри (секунди)
    const [totalTime, setTotalTime] = useState(settings.totalTime * 60);
    // Час на поточний хід (у секундах)
    const [turnTime, setTurnTime] = useState(settings.turnTimeLimit);

    // Форматування секунд у формат хв:сек
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // Загальний таймер гри
    useEffect(() => {
        if (totalTime <= 0) {
            // завершити гру – програв гравець
            dispatch(surrender());
            return;
        }

        const totalTimer = setInterval(() => {
            setTotalTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(totalTimer);
    }, [totalTime, dispatch]);

    //Таймер ходу (оновлюється кожну секунду)
    useEffect(() => {
        if (currentTurn !== "player") return;

        if (turnTime <= 0) {
            // час ходу вичерпано → передаємо хід ворогу
            dispatch(endPlayerTurn());
            setTurnTime(settings.turnTimeLimit);
            return;
        }

        const turnTimer = setInterval(() => {
            setTurnTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(turnTimer);
    }, [currentTurn, turnTime, dispatch, settings.turnTimeLimit]);

    // Скидання часу на хід при зміні черги
    useEffect(() => {
        if (currentTurn === "player") {
            setTurnTime(settings.turnTimeLimit);
        }
    }, [currentTurn, settings.turnTimeLimit]);

    return {
        turnTime,
        totalTime,
        formatTurnTime: `${turnTime}s`,
        formatTotalTime: formatTime(totalTime),
    };
}
