/**
 * @module Utils/GameLogic
 * @description Допоміжні функції для обробки ігрових координат, розрахунку позицій кораблів та логіки пострілів.
 */

import { GRID_SIZE, LETTERS } from "../constants/gameConstants";

/**
 * Перетворює строкову координату (напр. "A1") у матричні індекси об'єкта.
 * * @function coordToMatrix
 * @param {string} coord - Координата у форматі "БукваЧисло" (напр. "B5").
 * @returns {{row: number, col: number}} Об'єкт із нульовими індексами рядка та стовпця.
 */
export const coordToMatrix = (coord) => {
    const letter = coord[0];
    const number = parseInt(coord.slice(1), 10);
    const col = LETTERS.indexOf(letter);
    const row = number - 1;
    return { row, col };
};

/**
 * Перетворює числові матричні індекси назад у строкову координату.
 * * @function matrixToCoord
 * @param {number} row - Індекс рядка (0-9).
 * @param {number} col - Індекс стовпця (0-9).
 * @returns {string|null} Строкова координата (напр. "C3") або null, якщо індекси поза межами поля.
 */
export const matrixToCoord = (row, col) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return null;
    }
    return `${LETTERS[col]}${row + 1}`;
};

/**
 * Генерує всі координати, які займає корабель, на основі його параметрів.
 * * @function getShipPositions
 * @param {string} startCoord - Початкова клітинка (голова корабля).
 * @param {string} orientation - Орієнтація ('horizontal' або 'vertical').
 * @param {number} size - Довжина корабля.
 * @returns {string[]|null} Масив координат або null, якщо корабель виходить за межі сітки.
 */
export const getShipPositions = (startCoord, orientation, size) => {
    const { row: startR, col: startC } = coordToMatrix(startCoord);
    const positions = [];

    for (let i = 0; i < size; i++) {
        let r = startR;
        let c = startC;

        if (orientation === 'horizontal') {
            c += i;
        } else {
            r += i;
        }

        const coord = matrixToCoord(r, c);
        if (!coord) {
            return null; // Вихід за межі
        }
        positions.push(coord);
    }
    return positions;
};

/**
 * Знаходить усі сусідні клітинки навколо вказаної координати (включаючи діагоналі).
 * Використовується для розрахунку зон безпеки навколо кораблів.
 * * @function getNeighbors
 * @param {string} coord - Центральна координата.
 * @returns {string[]} Масив унікальних координат-сусідів.
 */
export const getNeighbors = (coord) => {
    const { row, col } = coordToMatrix(coord);
    const neighbors = new Set();

    for (let dR = -1; dR <= 1; dR++) {
        for (let dC = -1; dC <= 1; dC++) {
            if (dR === 0 && dC === 0) continue; // Пропускаємо саму клітинку

            const neighborCoord = matrixToCoord(row + dR, col + dC);
            if (neighborCoord) {
                neighbors.add(neighborCoord);
            }
        }
    }
    return Array.from(neighbors);
}

/**
 * Перевіряє, чи можна розмістити корабель у вказаних позиціях.
 * Перевірка базується на правилах: кораблі не можуть перетинатися або торкатися кутами/бортами.
 * * @function isPlacementValid
 * @param {string[]} newShipPositions - Координати нового корабля.
 * @param {Array} existingShips - Масив уже розміщених об'єктів кораблів.
 * @returns {Object} Об'єкт із результатом перевірки (містить valid та необов'язковий reason).
 */
export const isPlacementValid = (newShipPositions, existingShips) => {
    if (!newShipPositions || newShipPositions.length === 0) return { valid: false, reason: "Невірні позиції" };

    // Збираємо всі зайняті позиції та їхні зони безпеки (сусідство)
    const existingOccupiedAndSafetyZones = new Set();

    existingShips.flatMap(s => s.positions).forEach(coord => {
        // Додаємо саму позицію корабля
        existingOccupiedAndSafetyZones.add(coord);
        // Додаємо її сусідів (зону безпеки)
        getNeighbors(coord).forEach(existingOccupiedAndSafetyZones.add, existingOccupiedAndSafetyZones);
    });

    // Перевіряємо новий корабель: його позиції не повинні перетинатися з жодною клітинкою із зони безпеки
    for (const newPos of newShipPositions) {
        if (existingOccupiedAndSafetyZones.has(newPos)) {
            return { valid: false, reason: "Торкається або перетинається з існуючим кораблем/зоною безпеки" };
        }
    }

    return { valid: true };
};

/**
 * Обробляє логіку пострілу по масиву кораблів.
 * Визначає влучання, потоплення конкретного корабля та завершення гри.
 * * @function processShot
 * @param {string} coord - Координата пострілу.
 * @param {Array} ships - Поточний стан масиву кораблів.
 * @returns {Object} Результат пострілу: {isHit, updatedShips, isSunk, allSunk, sunkShipPositions}.
 */
export const processShot = (coord, ships) => {
    let isHit = false;
    let sunkShipPositions = []; // для збору клітинок потоплених кораблів

    let updatedShips = ships.map(ship => {
        const wasHit = ship.positions.includes(coord) && !ship.hits.includes(coord);

        if (wasHit) {
            isHit = true;
            const newHits = [...ship.hits, coord];
            const sunk = newHits.length === ship.positions.length;

            // Якщо корабель потоплений, збираємо всі його позиції
            if (sunk) {
                sunkShipPositions = [...sunkShipPositions, ...ship.positions];
            }

            return { ...ship, hits: newHits, isSunk: sunk };
        }
        return ship;
    });

    const allSunk = updatedShips.every(ship => ship.isSunk);

    return {
        isHit,
        updatedShips,
        isSunk: sunkShipPositions.length > 0, // Чи був потоплений хоч один корабель цим пострілом
        allSunk,
        sunkShipPositions
    };
};
