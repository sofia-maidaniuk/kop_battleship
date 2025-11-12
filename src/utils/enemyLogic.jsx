import { GRID_SIZE, LETTERS } from "../constants/gameConstants";
import { getNeighbors } from "./gameLogicUtils";

// глобальний стан бота
let baseHit = null;
let currentDirection = null;
let triedDirections = new Set();
let lastDirectionalHit = null;
let successfulHits = [];
let lockedAxis = null;

export function resetAIMemory() {
    baseHit = null;
    currentDirection = null;
    triedDirections = new Set();
    lastDirectionalHit = null;
    successfulHits = [];
    lockedAxis = null;
}

// наступна клітинка у напрямку
function getNextInDirection(coord, direction) {
    const col = coord[0];
    const row = parseInt(coord.slice(1), 10);
    const colIdx = LETTERS.indexOf(col);

    switch (direction) {
        case "up":
            return row > 1 ? `${col}${row - 1}` : null;
        case "down":
            return row < GRID_SIZE ? `${col}${row + 1}` : null;
        case "left":
            return colIdx > 0 ? `${LETTERS[colIdx - 1]}${row}` : null;
        case "right":
            return colIdx < GRID_SIZE - 1 ? `${LETTERS[colIdx + 1]}${row}` : null;
        default:
            return null;
    }
}

function getOppositeDirection(direction) {
    const opposites = { up: "down", down: "up", left: "right", right: "left" };
    return opposites[direction];
}

// визначити вісь за двома хітами
function detectAxis(a, b) {
    const rowA = parseInt(a.slice(1), 10);
    const rowB = parseInt(b.slice(1), 10);
    const colA = a[0];
    const colB = b[0];

    if (colA === colB) return "vertical";
    if (rowA === rowB) return "horizontal";
    return null;
}

// визначити напрямок за двома хітами
function detectDirection(from, to) {
    const rowFrom = parseInt(from.slice(1), 10);
    const rowTo = parseInt(to.slice(1), 10);
    const colFromIdx = LETTERS.indexOf(from[0]);
    const colToIdx = LETTERS.indexOf(to[0]);

    if (from[0] === to[0]) {
        return rowTo > rowFrom ? "down" : "up";
    }
    if (rowTo === rowFrom) {
        return colToIdx > colFromIdx ? "right" : "left";
    }
    return null;
}

export function getEnemyShot(playerBoard, aiMode = "random") {
    const alreadyShot = Object.keys(playerBoard.hits);
    let possibleShots = [];

    // легкий
    const randomShot = () => {
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 1; r <= GRID_SIZE; r++) {
                const coord = `${LETTERS[c]}${r}`;
                if (!alreadyShot.includes(coord)) {
                    possibleShots.push(coord);
                }
            }
        }
    };

    // середній
    const targetShot = () => {
        const hits = Object.keys(playerBoard.hits).filter(
            (c) => playerBoard.hits[c] === "hit"
        );

        // немає активних попадань
        if (hits.length === 0) {
            resetAIMemory();
            randomShot();
            return;
        }

        // якщо всі ці хіти вже стали sunk (корабель добитий) - скидаємося
        const allHitsSunk = hits.every((h) => playerBoard.hits[h] === "sunk");
        if (allHitsSunk) {
            resetAIMemory();
            randomShot();
            return;
        }

        // додати нові хіти в пам'ять
        hits.forEach((h) => {
            if (!successfulHits.includes(h)) {
                successfulHits.push(h);
            }
        });

        // якщо ще немає базового хіта
        if (!baseHit) {
            baseHit = successfulHits[0];
            lastDirectionalHit = baseHit;
        }

        // якщо є хоча б два хіти і вісь ще не зафіксована — фіксуємо вісь і напрямок
        if (successfulHits.length >= 2 && !lockedAxis) {
            const first = successfulHits[0];
            const second = successfulHits[1];
            const axis = detectAxis(first, second);
            if (axis) {
                lockedAxis = axis;
                const dir = detectDirection(first, second);
                if (dir) {
                    currentDirection = dir;
                    lastDirectionalHit = second;
                }
            }
        }

        // якщо вже є зафіксована вісь
        if (lockedAxis) {
            const axisDirections =
                lockedAxis === "vertical" ? ["up", "down"] : ["left", "right"];

            // якщо вже рухаємось у певному напрямку — пробуємо продовжити
            if (currentDirection) {
                const next = getNextInDirection(lastDirectionalHit, currentDirection);
                if (next && !alreadyShot.includes(next)) {
                    possibleShots.push(next);
                    return;
                }
                // якщо продовжити не можна — пробуємо протилежний від baseHit
                const opposite = getOppositeDirection(currentDirection);
                const oppFromBase = getNextInDirection(baseHit, opposite);
                if (oppFromBase && !alreadyShot.includes(oppFromBase)) {
                    currentDirection = opposite;
                    lastDirectionalHit = baseHit;
                    possibleShots.push(oppFromBase);
                    return;
                }
                // якщо і це не вийшло — скидаємо вісь і будемо шукати далі
                lockedAxis = null;
                currentDirection = null;
            }

            // якщо напрямок ще не вибрали в межах осі
            const shuffled = axisDirections.sort(() => Math.random() - 0.5);
            for (const dir of shuffled) {
                const next = getNextInDirection(baseHit, dir);
                if (next && !alreadyShot.includes(next)) {
                    currentDirection = dir;
                    lastDirectionalHit = baseHit;
                    possibleShots.push(next);
                    return;
                }
            }
        }

        // якщо вісь не визначена — пробуємо всі 4 сторони від baseHit у випадковому порядку
        const allDirs = ["up", "right", "down", "left"].sort(() => Math.random() - 0.5);
        for (const dir of allDirs) {
            if (triedDirections.has(dir)) continue;
            const next = getNextInDirection(baseHit, dir);
            if (next && !alreadyShot.includes(next)) {
                currentDirection = dir;
                lastDirectionalHit = baseHit;
                triedDirections.add(dir);
                possibleShots.push(next);
                return;
            } else {
                triedDirections.add(dir);
            }
        }

        // якщо все перепробували — скидаємось
        resetAIMemory();
        randomShot();
    };

    // важкий
    const smartShot = () => {
        const sunkCells = Object.keys(playerBoard.hits).filter(
            (c) => playerBoard.hits[c] === "sunk"
        );

        const forbidden = new Set();
        sunkCells.forEach((coord) => {
            getNeighbors(coord).forEach((n) => forbidden.add(n));
            forbidden.add(coord);
        });

        targetShot();

        possibleShots = possibleShots.filter((coord) => !forbidden.has(coord));

        if (possibleShots.length === 0) {
            for (let c = 0; c < GRID_SIZE; c++) {
                for (let r = 1; r <= GRID_SIZE; r++) {
                    const coord = `${LETTERS[c]}${r}`;
                    if (!alreadyShot.includes(coord) && !forbidden.has(coord)) {
                        possibleShots.push(coord);
                    }
                }
            }
        }

        if (possibleShots.length === 0) {
            randomShot();
        }
    };

    // вибір режиму
    switch (aiMode) {
        case "target":
            targetShot();
            break;
        case "smart":
            smartShot();
            break;
        default:
            randomShot();
    }

    // якщо всі кораблі потоплені — скидаємо пам'ять
    const allSunk = playerBoard.ships.every((ship) => ship.isSunk);
    if (allSunk) {
        resetAIMemory();
    }

    if (possibleShots.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * possibleShots.length);
    return possibleShots[randomIndex];
}
