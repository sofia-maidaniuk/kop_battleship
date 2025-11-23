import React, { useState } from "react";
import { Grid } from "../components/Grid";
import { ShipPlacementControls } from "../components/ShipPlacementControls";
import "./ShipPlacementPage.css";
import { generateAutoPlacement } from "../utils/shipUtils";
import { usePlayerPlacement } from "../hook/usePlayerPlacement";

export function ShipPlacementPage({ onStartBattle, onBack }) {
    // Використання хука для керування станом
    const {
        ships,
        placeShip,
        toggleOrientation,
        selectedShipSize,
        setSelectedShipSize,
        orientation,
        canStartBattle,
        resetPlacement,
        placedShipCounts,
        setShips,
        previewShipPositions,
        isPreviewValid,
        handleCellHover,
    } = usePlayerPlacement();

    // Стан для відображення повідомлення користувачу про успіх/помилку
    const [message, setMessage] = useState('');

    const showMessage = (text, isSuccess = false) => {
        setMessage(text);
        setTimeout(() => setMessage(''), 3000);
        return isSuccess;
    };

    const handleAutoPlacement = () => {
        const newShips = generateAutoPlacement();
        setShips(newShips);
        showMessage("Кораблі успішно розміщено автоматично!", true);
    };

    const handleReset = () => {
        resetPlacement();
        showMessage("Розміщення кораблів скинуто.", false);
    };

    const handleCellClick = (coord) => {
        const result = placeShip(coord);
        showMessage(result.message, result.success);
    };

    const handleStartBattleClick = () => {
        if (!canStartBattle) {
            // Якщо не всі кораблі розставлені
            showMessage("Розставте всі кораблі перед початком бою.", false);
            return;
        }

        // Якщо валідація пройшла успішно
        onStartBattle(ships);
    };

    return (
        <div className="placement-page">
            <h1>Розставлення кораблів</h1>

            <div className="message-area-wrapper">
                {message && (
                    <div className={`placement-message ${message.includes('успішно') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="placement-content">
                {/* Ліва частина — сітка */}
                <div
                    className="grid-container"
                    onMouseLeave={() => handleCellHover(null)} // Скидаємо hover при виході з контейнера
                >
                    <Grid
                        ships={ships}
                        showShips={true}
                        isEnemy={false}
                        onCellClick={handleCellClick}
                        onCellHover={handleCellHover} // Передаємо функцію обробки наведення
                        previewPositions={previewShipPositions} // Передаємо позиції прев'ю
                        isHoverValid={isPreviewValid} // Передаємо валідність прев'ю
                    />
                </div>

                {/* Права частина — панель управління */}
                <div className="controls-panel">
                    <ShipPlacementControls
                        selectedShipSize={selectedShipSize}
                        setSelectedShipSize={setSelectedShipSize}
                        orientation={orientation}
                        toggleOrientation={toggleOrientation}
                        placedShipCounts={placedShipCounts}
                        onAutoPlacement={handleAutoPlacement}
                        onReset={handleReset}
                    />
                </div>
            </div>

            <div className="bottom-buttons">
                <button className="btn btn-back" onClick={onBack}>
                    Назад
                </button>
                <button
                    className="btn btn-start"
                    onClick={handleStartBattleClick}
                    disabled={false}
                >
                    Почати бій
                </button>
            </div>
        </div>
    );
}
