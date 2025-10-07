import React, { useState } from "react";
import { Grid } from "../components/Grid";
import { ShipPlacementControls } from "../components/ShipPlacementControls";
import "../styles/ShipPlacementPage.css";

export function ShipPlacementPage({ onStartBattle, onBack }) {
    const [ships, setShips] = useState([]);

    const handleAutoPlacement = () => {
        const autoShips = [
            { cells: [[0, 0], [1, 0], [2, 0]] },
            { cells: [[4, 2], [4, 3]] },
            { cells: [[1, 4]] },
            { cells: [[3, 1]] },
        ];
        setShips(autoShips);
    };

    return (
        <div className="placement-page">
            <h1>Розставлення кораблів</h1>

            <div className="placement-content">
                {/* Ліва частина — сітка */}
                <div className="grid-container">
                    <Grid ships={ships} />
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
