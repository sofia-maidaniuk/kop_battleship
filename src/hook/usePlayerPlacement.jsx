/**
 * @module Hooks/usePlayerPlacement
 * @description Кастомний хук для керування процесом інтерактивного розміщення кораблів гравцем.
 * Забезпечує логіку вибору розміру корабля, зміни орієнтації, відображення прев'ю при наведенні
 * та автоматичного перемикання між типами кораблів.
 */

import { useState, useMemo, useCallback } from 'react';
import { getShipPositions, isPlacementValid } from '../utils/gameLogicUtils';
import { createShip } from '../utils/shipUtils';
import { SHIP_TYPES } from '../constants/gameConstants';

/**
 * Хук usePlayerPlacement.
 * * @function usePlayerPlacement
 * @param {Array} [initialShips=[]] - Початковий масив кораблів (за замовчуванням порожній).
 * @returns {Object} Об'єкт із методами та станами для екрана розміщення:
 * { ships, placeShip, toggleOrientation, selectedShipSize, setSelectedShipSize,
 * orientation, canStartBattle, resetPlacement, placedShipCounts, setShips,
 * previewShipPositions, isPreviewValid, handleCellHover }
 */
export function usePlayerPlacement(initialShips = []) {
    /** Стейт розміщених кораблів. @type {Array} */
    const [ships, setShips] = useState(initialShips);
    /** Розмір корабля, обраний для наступного розміщення. @type {Array} */
    const [selectedShipSize, setSelectedShipSize] = useState(SHIP_TYPES.THREE_DECK.size);
    /** Поточна орієнтація. @type {Array} */
    const [orientation, setOrientation] = useState('horizontal');
    /** Координата клітинки, на яку наведено курсор. @type {Array} */
    const [hoveredCoord, setHoveredCoord] = useState(null);

    /**
     * Об'єкт із кількістю вже розміщених кораблів кожного типу (розміру).
     * Оновлюється автоматично при зміні масиву ships.
     * @type {Object.<number, number>}
     */
    const placedShipCounts = useMemo(() => {
        // Ми використовуємо positions.length як size
        return ships.reduce((acc, ship) => {
            acc[ship.positions.length] = (acc[ship.positions.length] || 0) + 1;
            return acc;
        }, {});
    }, [ships]);

    /**
     * Чи виконані умови для початку битви (чи всі необхідні кораблі розміщені).
     * @type {boolean}
     */
    const canStartBattle = useMemo(() => {
        const requiredShips = Object.values(SHIP_TYPES);
        return requiredShips.every(type =>
            (placedShipCounts[type.size] || 0) === type.count
        );
    }, [placedShipCounts]);

    /**
     * Змінює орієнтацію корабля на протилежну.
     * @function toggleOrientation
     */
    const toggleOrientation = () => {
        setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
    };

    /**
     * Повністю очищує поле та скидає вибір корабля.
     * @function resetPlacement
     */
    const resetPlacement = () => {
        setShips([]);
        setSelectedShipSize(SHIP_TYPES.THREE_DECK.size);
        setOrientation('horizontal');
    };

    /**
     * Список координат для відображення "примарного" прев'ю корабля під курсором.
     * @type {string[]}
     */
    const previewShipPositions = useMemo(() => {
        if (!hoveredCoord || !selectedShipSize) return [];

        return getShipPositions(hoveredCoord, orientation, selectedShipSize) || [];
    }, [hoveredCoord, orientation, selectedShipSize]);

    /**
     * Чи є поточне положення прев'ю допустимим для розміщення.
     * @type {boolean}
     */
    const isPreviewValid = useMemo(() => {
        if (previewShipPositions.length === 0 || previewShipPositions.length !== selectedShipSize) return false;

        return isPlacementValid(previewShipPositions, ships).valid;
    }, [previewShipPositions, ships, selectedShipSize]);

    /**
     * Намагається розмістити корабель у вказаній координаті.
     * Містить логіку валідації та автоматичного перемикання на наступний тип корабля.
     * * @function placeShip
     * @param {string} startCoord - Координата "голови" корабля.
     * @returns {Object} {success: boolean, message: string} Результат спроби розміщення.
     */
    const placeShip = useCallback((startCoord) => {
        const sizeToPlace = selectedShipSize;

        const currentCount = placedShipCounts[sizeToPlace] || 0;
        const maxShipType = Object.values(SHIP_TYPES).find(t => t.size === sizeToPlace);
        const maxCount = maxShipType?.count || 0;
        const currentCountAfterPlacement = currentCount + 1;

        if (currentCount >= maxCount) {
            return {
                success: false,
                message: `Всі кораблі цього типу вже розміщено.`
            };
        }

        const newShipPositions = getShipPositions(startCoord, orientation, sizeToPlace);

        if (!newShipPositions) {
            return { success: false, message: "Корабель виходить за межі поля." };
        }

        const validationResult = isPlacementValid(newShipPositions, ships);

        if (!validationResult.valid) {
            return { success: false, message: validationResult.reason };
        }

        /** ЛОГІКА АВТОПЕРЕМИКАННЯ: вибір наступного доступного розміру */
        if (currentCountAfterPlacement === maxCount) {

            const sortedShipTypes = Object.values(SHIP_TYPES)
                .sort((a, b) => b.size - a.size);

            // Шукаємо наступний найбільший тип, який ще не розміщено
            const nextShipType = sortedShipTypes.find(type => {

                // Пропускаємо тип, який ми щойно заповнили (він вже досяг maxCount)
                if (type.size === sizeToPlace) return false;

                // Перевіряємо інші типи: чи потрібен ще хоча б один
                return (placedShipCounts[type.size] || 0) < type.count;
            });

            if (nextShipType) {
                setSelectedShipSize(nextShipType.size); // Встановлюємо розмір наступного
            } else {
                // Якщо всі кораблі розміщені (1x3, 1x2, 2x1)
                setSelectedShipSize(null); // Скидаємо вибір, щоб деактивувати розміщення
            }
        }

        // Зберігаємо новий корабель
        const newShip = createShip(newShipPositions, orientation, sizeToPlace, maxShipType.name);
        setShips(prevShips => [...prevShips, newShip]);

        return { success: true, message: `Корабель розміром ${sizeToPlace} успішно додано.` };
    }, [selectedShipSize, orientation, placedShipCounts, ships]); // залежності для useCallback

    return {
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
        handleCellHover: setHoveredCoord,
    };
}
