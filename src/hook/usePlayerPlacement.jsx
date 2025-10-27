// ===================================
// Файл: src/hooks/usePlayerPlacement.jsx (ФІНАЛЬНА ВЕРСІЯ З ЛОГІКОЮ ПЕРЕМИКАННЯ)
// ===================================
import { useState, useMemo, useCallback } from 'react';
import { getShipPositions, isPlacementValid } from '../utils/gameLogicUtils';
import { createShip } from '../utils/shipUtils';
import { SHIP_TYPES } from '../constants/gameConstants';

// Хук для керування інтерактивним розміщенням кораблів гравцем
export function usePlayerPlacement(initialShips = []) {
    const [ships, setShips] = useState(initialShips);
    const [selectedShipSize, setSelectedShipSize] = useState(SHIP_TYPES.THREE_DECK.size);
    const [orientation, setOrientation] = useState('horizontal');
    const [hoveredCoord, setHoveredCoord] = useState(null);

    // Рахуємо, скільки кораблів кожного типу вже розміщено
    const placedShipCounts = useMemo(() => {
        // Ми використовуємо positions.length як size
        return ships.reduce((acc, ship) => {
            acc[ship.positions.length] = (acc[ship.positions.length] || 0) + 1;
            return acc;
        }, {});
    }, [ships]); // Залежність від ships

    // Перевіряємо, чи всі кораблі розміщені
    const canStartBattle = useMemo(() => {
        const requiredShips = Object.values(SHIP_TYPES);
        return requiredShips.every(type =>
            (placedShipCounts[type.size] || 0) === type.count
        );
    }, [placedShipCounts]); // Залежність від placedShipCounts

    const toggleOrientation = () => {
        setOrientation((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'));
    };

    const resetPlacement = () => {
        setShips([]);
        setSelectedShipSize(SHIP_TYPES.THREE_DECK.size); // Повертаємо вибір до найбільшого
        setOrientation('horizontal');
    };

    // ЛОГІКА ПРЕВ'Ю
    const previewShipPositions = useMemo(() => {
        if (!hoveredCoord || !selectedShipSize) return [];

        return getShipPositions(hoveredCoord, orientation, selectedShipSize) || [];
    }, [hoveredCoord, orientation, selectedShipSize]);

    const isPreviewValid = useMemo(() => {
        if (previewShipPositions.length === 0 || previewShipPositions.length !== selectedShipSize) return false;

        return isPlacementValid(previewShipPositions, ships).valid;
    }, [previewShipPositions, ships, selectedShipSize]);

    // Обробник кліку
    const placeShip = useCallback((startCoord) => {
        const sizeToPlace = selectedShipSize;

        const currentCount = placedShipCounts[sizeToPlace] || 0;
        const maxShipType = Object.values(SHIP_TYPES).find(t => t.size === sizeToPlace);
        const maxCount = maxShipType?.count || 0;
        const currentCountAfterPlacement = currentCount + 1; // Гіпотетичний рахунок

        if (currentCount >= maxCount) {
            return {
                success: false,
                message: `Всі кораблі цього типу вже розміщено.`
            };
        }

        const newShipPositions = getShipPositions(startCoord, orientation, sizeToPlace);

        if (!newShipPositions) {
            return { success: false, message: "Корабель виходить за межі поля 5x5." };
        }

        const validationResult = isPlacementValid(newShipPositions, ships);

        if (!validationResult.valid) {
            return { success: false, message: "Кораблі не можуть торкатися бортами чи кутами. Спробуйте іншу позицію." };
        }

        //ЛОГІКА АВТОПЕРЕМИКАННЯ
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
