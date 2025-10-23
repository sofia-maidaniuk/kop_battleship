import React from "react";
import "../styles/ShipPlacementControls.css";
import { SHIP_TYPES } from "../constants/gameConstants";

// Компонент тепер приймає всю логіку з хука через props
export function ShipPlacementControls({
                                          selectedShipSize,
                                          setSelectedShipSize,
                                          orientation,
                                          toggleOrientation,
                                          placedShipCounts,
                                          onAutoPlacement,
                                          onReset
                                      }) {
    const shipButtons = Object.values(SHIP_TYPES)
        .sort((a, b) => b.size - a.size); // Від більшого до меншого

    return (
        <div className="ship-controls">
            <div className="ship-types">
                <span>Оберіть корабель (розміщено):</span><br/>
                <div className={'ship-buttons-row'}>
                    {shipButtons.map(shipType => {
                        const count = placedShipCounts[shipType.size] || 0;
                        const maxCount = shipType.count;
                        const isMax = count >= maxCount;

                        return (
                            <button
                                key={shipType.size}
                                className={`btn ship-btn ${selectedShipSize === shipType.size ? "active" : ""} ${isMax ? "disabled" : ""}`}
                                onClick={() => setSelectedShipSize(shipType.size)}
                                // Залишаємо кнопку активною, якщо це поточний вибір, навіть якщо ліміт вичерпано
                                disabled={isMax && selectedShipSize !== shipType.size}
                            >
                                {shipType.size}-палубний ({count}/{maxCount})
                            </button>
                        );
                    })}
                </div>
            </div>

            <button className="btn full-width" onClick={toggleOrientation}>
                🔄 {orientation === "horizontal" ? "Горизонтальна" : "Вертикальна"}
            </button>

            <button className="btn btn-secondary full-width" onClick={onAutoPlacement}>
                Автоматично розставити
            </button>

            <button className="btn btn-danger full-width" onClick={onReset}>
                Скинути все
            </button>

        </div>
    );
}
