import { useState, useEffect } from "react";

export function useGameTimers(currentTurn, actions, settings) {
    // Загальний час у секундах (перетворюємо з хвилин)
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
            // Якщо час гри вичерпано — завершити гру (гравець програв)
            actions.surrender("player");
            return;
        }

        const totalTimer = setInterval(() => {
            setTotalTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(totalTimer);
    }, [totalTime, actions]);

    //Таймер ходу (оновлюється кожну секунду)
    useEffect(() => {
        // Таймер працює лише під час ходу гравця
        if (currentTurn !== "player" || turnTime <= 0) return;

        const turnTimer = setInterval(() => {
            setTurnTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(turnTimer);
    }, [currentTurn, turnTime]);

    // Коли час ходу гравця вичерпано
    useEffect(() => {
        if (turnTime === 0 && currentTurn === "player") {
            // Якщо час гравця вичерпано — передаємо хід ворогу
            actions.endPlayerTurn(); // нова дія у useBattleshipGame
            setTurnTime(settings.turnTimeLimit); // скидаємо таймер на наступний хід
        }
    }, [turnTime, currentTurn, actions, settings.turnTimeLimit]);

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
