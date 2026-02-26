/**
 * @module Utils/ShipGeneration
 * @description Модуль для автоматичної генерації розстановки кораблів та створення об'єктів флоту.
 */

import { GRID_SIZE, LETTERS, SHIP_TYPES } from "../constants/gameConstants";
import { getShipPositions, isPlacementValid } from "./gameLogicUtils";

/**
 * Функція-фабрика для створення об'єкта корабля.
 * * @function createShip
 * @param {string[]} positions - Масив координат, які займає корабель (напр. ["A1", "A2"]).
 * @param {string} [orientation="horizontal"] - Орієнтація корабля.
 * @param {number} type - Розмір/тип корабля.
 * @returns {Object} Об'єкт корабля з унікальним ідентифікатором та станом влучань.
 */
export const createShip = (positions, orientation = "horizontal", type) => ({
    id: Math.random().toString(36).slice(2, 9),
    positions,
    orientation,
    type,
    hits: [],
    isSunk: false,
});

/**
 * Генерує випадкову розстановку кораблів для поля 5x5.
 * Використовує метод перебору з максимальною кількістю спроб (1000) для кожної одиниці флоту.
 * Якщо розстановка заходить у глухий кут, функція рекурсивно запускає процес спочатку.
 * * @function generateRandomPlacement
 * @returns {Object[]} Масив об'єктів кораблів, розміщених згідно з правилами (без торкання).
 */
export const generateRandomPlacement = () => {
    const ships = [];
    /** @type {number[]} Відсортований за спаданням масив розмірів кораблів (напр. [3, 2, 1, 1]) */
    const shipSizes = Object.values(SHIP_TYPES)
        .flatMap(type => Array(type.count).fill(type.size))
        .sort((a, b) => b - a); // Починаємо з найбільших: [3, 2, 1, 1]

    const MAX_ATTEMPTS = 1000;

    for (const size of shipSizes) {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < MAX_ATTEMPTS) {
            attempts++;

            // Рандомна орієнтація
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

            // Рандомна початкова координата (забезпечуємо, щоб корабель помістився від стартової клітинки)
            const maxRow = orientation === 'vertical' ? GRID_SIZE - size + 1 : GRID_SIZE;
            const maxCol = orientation === 'horizontal' ? GRID_SIZE - size + 1 : GRID_SIZE;

            const randomR = Math.floor(Math.random() * maxRow);
            const randomC = Math.floor(Math.random() * maxCol);

            // Якщо рандом вийшов за межі 5x5 (хоча maxRow/maxCol мають це обмежити)
            if (randomR >= GRID_SIZE || randomC >= GRID_SIZE) continue;

            const startCoord = `${LETTERS[randomC]}${randomR + 1}`;

            // отримання всіх позицій
            const newShipPositions = getShipPositions(startCoord, orientation, size);

            if (!newShipPositions || newShipPositions.length !== size) {
                continue;
            }

            // Валідація розміщення з урахуванням зон безпеки
            const validationResult = isPlacementValid(newShipPositions, ships);

            if (validationResult.valid) {
                // Розміщення та перехід до наступного корабля
                ships.push(createShip(newShipPositions, orientation, size));
                placed = true;
            }
        }

        if (!placed) {
            // Якщо вичерпали ліміт спроб, поле, ймовірно, заблоковано. Починаємо спочатку.
            console.warn(`Неможливо розмістити корабель розміру ${size} за ${MAX_ATTEMPTS} спроб. Повторний запуск генерації.`);
            return generateRandomPlacement();
        }
    }

    return ships;
};

/** * Псевдонім для функції generateRandomPlacement.
 * Використовується для автоматичного розміщення кораблів у компонентах.
 * @constant
 */
export const generateAutoPlacement = generateRandomPlacement;
