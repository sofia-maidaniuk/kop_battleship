import React, { useState } from "react";
import { Grid } from "../components/Grid";
import { ShipPlacementControls } from "../components/ShipPlacementControls";
import "../styles/ShipPlacementPage.css";
import { generateAutoPlacement } from "../utils/shipUtils";

export function ShipPlacementPage({ onStartBattle, onBack }) {
    const [ships, setShips] = useState([]);

    const handleAutoPlacement = () => {
        setShips(generateAutoPlacement());
    };

    return (
        <div className="placement-page">
            <h1>Розставлення кораблів</h1>

            <div className="placement-content">
                {/* Ліва частина — сітка */}
                <div className="grid-container">
                    <Grid ships={ships} showShips={true} isEnemy={false} />
                </div>

                {/* Права частина — панель управління */}
                <div className="controls-panel">
                    <ShipPlacementControls />
                    <button className="btn btn-secondary full-width" onClick={handleAutoPlacement}>
                        Автоматично розставити
                    </button>
                </div>
            </div>

            <div className="bottom-buttons">
                <button className="btn btn-back" onClick={onBack}>
                    Назад
                </button>
                <button className="btn btn-start" onClick={onStartBattle}>
                    Почати гру
                </button>
            </div>
        </div>
    );
}
