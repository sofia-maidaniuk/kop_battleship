import React, { useState } from "react";
import { Grid } from "../components/Grid";
import { ShipPlacementControls } from "../components/ShipPlacementControls";
import "./ShipPlacementPage.css";
import { generateAutoPlacement } from "../utils/shipUtils";
import { usePlayerPlacement } from "../hook/usePlayerPlacement";
import { useNavigate, useParams } from "react-router-dom";

export function ShipPlacementPage({ onStartBattle, onBack }) {
    const navigate = useNavigate();
    const { userId } = useParams();

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

    const [message, setMessage] = useState("");

    const showMessage = (text, isSuccess = false) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 3000);
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
            showMessage("Розставте всі кораблі перед початком бою.", false);
            return;
        }

        onStartBattle(ships);
        navigate(`/user/${userId}/game`);
    };

    return (
        <div className="placement-page">
            <h1>Розставлення кораблів</h1>

            <div className="message-area-wrapper">
                {message && (
                    <div
                        className={`placement-message ${
                            message.includes("успішно") ? "success" : "error"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </div>

            <div className="placement-content">
                <div
                    className="grid-container"
                    onMouseLeave={() => handleCellHover(null)}
                >
                    <Grid
                        ships={ships}
                        showShips={true}
                        isEnemy={false}
                        onCellClick={handleCellClick}
                        onCellHover={handleCellHover}
                        previewPositions={previewShipPositions}
                        isHoverValid={isPreviewValid}
                    />
                </div>

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
                <button
                    className="btn btn-back"
                    onClick={() => navigate(`/user/${userId}/settings`)}
                >
                    Назад
                </button>

                <button
                    className="btn btn-start"
                    onClick={handleStartBattleClick}
                >
                    Почати бій
                </button>
            </div>
        </div>
    );
}
