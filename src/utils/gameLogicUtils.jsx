import { GRID_SIZE, LETTERS } from "../constants/gameConstants";

//Перетворює координату на матричні індекси { row: number, col: number }.
export const coordToMatrix = (coord) => {
    const letter = coord[0];
    const number = parseInt(coord.slice(1), 10);
    const col = LETTERS.indexOf(letter);
    const row = number - 1;
    return { row, col };
};

//Перетворює матричні індекси на координату
//Повертає null, якщо індекси виходять за межі сітки.
export const matrixToCoord = (row, col) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return null;
    }
    return `${LETTERS[col]}${row + 1}`;
};

//Генерує всі координати корабля, виходячи з початкової клітинки, орієнтації та розміру
//Повертає null, якщо корабель виходить за межі сітки
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

//Отримує всі сусідні координати (включно з діагоналями) для однієї клітинки.

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

//Перевіряє, чи можна безпечно розмістити новий корабель, враховуючи правило про не торкання кутами чи бортами
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

export const processShot = (coord, ships) => {
    let isHit = false;
    let updatedShips = ships.map(ship => {
        const wasHit = ship.positions.includes(coord) && !ship.hits.includes(coord);
        if (wasHit) {
            isHit = true;
            const newHits = [...ship.hits, coord];
            const sunk = newHits.length === ship.positions.length;
            return { ...ship, hits: newHits, isSunk: sunk };
        }
        return ship;
    });

    const allSunk = updatedShips.every(ship => ship.isSunk);

    return {
        isHit,
        updatedShips,
        isSunk: updatedShips.some(s => s.isSunk),
        allSunk
    };
};
