/**
 * @module Components/UI
 * @description Компонент панелі керування розстановкою кораблів.
 * Надає інтерфейс для вибору розміру корабля, зміни його орієнтації,
 * запуску автоматичної генерації розстановки та повного скидання поля.
 */

import React from "react";
import styles from "./ShipPlacementControls.module.css";
import { SHIP_TYPES } from "../constants/gameConstants";

/**
 * Компонент ShipPlacementControls.
 * * @component
 * @param {Object} props - Властивості компонента.
 * @param {number|null} props.selectedShipSize - Поточний розмір корабля, обраний для розміщення.
 * @param {Function} props.setSelectedShipSize - Функція для встановлення розміру обраного корабля.
 * @param {('horizontal'|'vertical')} props.orientation - Поточна орієнтація корабля для розміщення.
 * @param {Function} props.toggleOrientation - Функція для перемикання між горизонтальною та вертикальною орієнтацією.
 * @param {Object.<number, number>} props.placedShipCounts - Об'єкт, що містить кількість уже розміщених кораблів кожного розміру.
 * @param {Function} props.onAutoPlacement - Функція для ініціалізації автоматичної випадкової розстановки флоту.
 * @param {Function} props.onReset - Функція для повного очищення поля від кораблів.
 * * @returns {JSX.Element} Рендерить блок кнопок керування розстановкою.
 */
export function ShipPlacementControls({
                                          selectedShipSize,
                                          setSelectedShipSize,
                                          orientation,
                                          toggleOrientation,
                                          placedShipCounts,
                                          onAutoPlacement,
                                          onReset
                                      }) {
    /** * Сортування типів кораблів від найбільшого до найменшого для зручності вибору в UI.
     * @type {Array<Object>}
     */
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

            {/* Кнопка зміни орієнтації */}
            <button className={`${styles.fullBtn} ${styles.secondary}`} onClick={toggleOrientation}>
                🔄 {orientation === "horizontal" ? "Горизонтальна" : "Вертикальна"}
            </button>

            {/* Кнопка автоматичної розстановки */}
            <button className={`${styles.fullBtn} ${styles.secondary}`} onClick={onAutoPlacement}>
                Автоматично розставити
            </button>

            {/* Кнопка скидання результатів */}
            <button className={`${styles.fullBtn} ${styles.danger}`} onClick={onReset}>
                Скинути все
            </button>
        </div>
    );
}
