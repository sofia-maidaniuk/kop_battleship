import React from "react";
import styles from "./ShipPlacementControls.module.css";
import { SHIP_TYPES } from "../constants/gameConstants";

export function ShipPlacementControls({
                                          selectedShipSize,
                                          setSelectedShipSize,
                                          orientation,
                                          toggleOrientation,
                                          placedShipCounts,
                                          onAutoPlacement,
                                          onReset
                                      }) {
    const shipButtons = Object.values(SHIP_TYPES).sort((a, b) => b.size - a.size);

    return (
        <div className={styles.wrapper}>

            <div className={styles.label}>Оберіть корабель (розміщено):</div>

            <div className={styles.shipButtonsRow}>
                {shipButtons.map(shipType => {
                    const count = placedShipCounts[shipType.size] || 0;
                    const max = shipType.count;
                    const isMax = count >= max;

                    return (
                        <button
                            key={shipType.size}
                            className={`${styles.shipBtn} 
                                ${selectedShipSize === shipType.size ? styles.active : ""} 
                                ${isMax && selectedShipSize !== shipType.size ? styles.disabled : ""}`}
                            onClick={() => setSelectedShipSize(shipType.size)}
                            disabled={isMax && selectedShipSize !== shipType.size}
                        >
                            {shipType.size}-палубний ({count}/{max})
                        </button>
                    );
                })}
            </div>

            <button className={`${styles.fullBtn} ${styles.secondary}`} onClick={toggleOrientation}>
                🔄 {orientation === "horizontal" ? "Горизонтальна" : "Вертикальна"}
            </button>

            <button className={`${styles.fullBtn} ${styles.secondary}`} onClick={onAutoPlacement}>
                Автоматично розставити
            </button>

            <button className={`${styles.fullBtn} ${styles.danger}`} onClick={onReset}>
                Скинути все
            </button>
        </div>
    );
}
