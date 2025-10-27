import { GRID_SIZE, LETTERS, SHIP_TYPES } from "../constants/gameConstants";
import { getShipPositions, isPlacementValid } from "./gameLogicUtils";

export const createShip = (positions, orientation = "horizontal", type) => ({
    id: Math.random().toString(36).slice(2, 9),
    positions,
    orientation,
    type,
    hits: [],
    isSunk: false,
});

//Генерує список кораблів для поля 5x5 згідно з правилами (1x3, 1x2, 2x1) з рандомним розміщенням, яке не дозволяє кораблям торкатися кутами чи бортами.

export const generateRandomPlacement = () => {
    const ships = [];
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

// Перевизначаємо placeholder, щоб наші хуки використовували нову логіку:
export const generateAutoPlacement = generateRandomPlacement;
