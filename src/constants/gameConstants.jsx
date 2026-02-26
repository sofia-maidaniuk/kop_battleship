/**
 * @module Constants/Game
 * @description Глобальні константи для налаштування параметрів гри "Морський бій".
 * Визначає розмір ігрового поля, систему координат та склад флоту.
 */

/** * Розмір квадратної ігрової сітки (кількість клітинок по одній стороні).
 * @constant {number}
 * @default 5
 */
export const GRID_SIZE = 5;

/** * Масив літер для позначення колонок ігрового поля.
 * Використовується для формування координат типу "А1", "Б2" тощо.
 * @constant {string[]}
 */
export const LETTERS = ["А", "Б", "В", "Г", "Д"];

/**
 * Опис типів кораблів та їх характеристик.
 * @constant {Object}
 * @property {Object} THREE_DECK - Трьохпалубний корабель.
 * @property {number} THREE_DECK.size - Кількість клітинок (3).
 * @property {number} THREE_DECK.count - Кількість кораблів цього типу на полі (1).
 * @property {string} THREE_DECK.name - Українська назва типу.
 * * @property {Object} TWO_DECK - Двопалубний корабель.
 * @property {number} TWO_DECK.size - Кількість клітинок (2).
 * @property {number} TWO_DECK.count - Кількість кораблів цього типу на полі (1).
 * @property {string} TWO_DECK.name - Українська назва типу.
 * * @property {Object} ONE_DECK - Однопалубний корабель.
 * @property {number} ONE_DECK.size - Кількість клітинок (1).
 * @property {number} ONE_DECK.count - Кількість кораблів цього типу на полі (2).
 * @property {string} ONE_DECK.name - Українська назва типу.
 */
export const SHIP_TYPES = {
    THREE_DECK: { size: 3, count: 1, name: "3-палубний" },
    TWO_DECK:   { size: 2, count: 1, name: "2-палубний" },
    ONE_DECK:   { size: 1, count: 2, name: "1-палубний" },
};
