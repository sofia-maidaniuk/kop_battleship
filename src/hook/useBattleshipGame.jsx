import { useReducer, useMemo, useEffect, useCallback } from 'react';
import { processShot } from '../utils/gameLogicUtils';
import { generateAutoPlacement } from '../utils/shipUtils';
import { GRID_SIZE, LETTERS } from '../constants/gameConstants';

const GamePhase = {
    START: 'start',
    PLACEMENT: 'placement',
    GAME: 'game',
    RESULT: 'result',
    RULES: 'rules'
};

const initialBoardState = {
    ships: [],
    hits: {}, //стан клітинок
};

// Ворожий флот генерується лише раз при ініціалізації
const generateInitialEnemyBoard = () => ({
    ...initialBoardState,
    ships: generateAutoPlacement()
});

const initialState = {
    phase: GamePhase.START,
    currentTurn: 'player', // 'player' або 'enemy'
    playerBoard: initialBoardState,
    enemyBoard: generateInitialEnemyBoard(),
    winner: null,
};

// REDUCER
function gameReducer(state, action) {
    switch (action.type) {
        case 'SET_PHASE':
            return { ...state, phase: action.payload };

        case 'RESTART_GAME':
            // Скидаємо все, включаючи нову рандомну генерацію для ворога
            return { ...initialState, enemyBoard: { ...initialBoardState, ships: generateAutoPlacement() } };

        case 'START_GAME_WITH_SHIPS':
            // Гравець передає свої розміщені кораблі
            return {
                ...state,
                phase: GamePhase.GAME,
                playerBoard: { ...state.playerBoard, ships: action.payload },
            };

        case 'TAKE_SHOT': {
            const { coord, shooter } = action.payload;
            const target = shooter === 'player' ? 'enemy' : 'player';

            const targetBoardKey = target === 'enemy' ? 'enemyBoard' : 'playerBoard';
            const targetBoard = state[targetBoardKey];

            if (targetBoard.hits[coord]) return state;

            const shotResult = processShot(coord, targetBoard.ships);

            // Створюємо новий об'єкт hits на основі попередніх
            let newHits = { ...targetBoard.hits };

            // Маркуємо клітинку поточного пострілу як 'hit' або 'miss'
            const hitState = shotResult.isHit ? 'hit' : 'miss';
            newHits[coord] = hitState;

            // Якщо корабель потоплений, маркуємо УСІ його клітинки як 'sunk'
            if (shotResult.sunkShipPositions && shotResult.sunkShipPositions.length > 0) {
                shotResult.sunkShipPositions.forEach(pos => {
                    newHits[pos] = 'sunk';
                });
            }

            const newBoard = {
                ships: shotResult.updatedShips,
                hits: newHits
            };

            const nextState = {
                ...state,
                [targetBoardKey]: newBoard,
                currentTurn: shotResult.isHit ? shooter : (shooter === 'player' ? 'enemy' : 'player'),
                winner: shotResult.allSunk ? shooter : null,
            };

            if (shotResult.allSunk) {
                nextState.phase = GamePhase.RESULT;
            }

            return nextState;
        }

        case 'SURRENDER':
            return {
                ...state,
                phase: GamePhase.RESULT,
                winner: action.payload === 'player' ? 'enemy' : 'player',
            };

        default:
            return state;
    }
}

export function useBattleshipGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // Створюємо takeShot як useCallback, щоб він був стабільним для useEffect
    const takeShot = useCallback((coord, shooter = 'player') => {
        dispatch({ type: 'TAKE_SHOT', payload: { coord, shooter } });
    }, []);

    // Простий рандомний постріл бота (поки що)
    useEffect(() => {
        if (state.phase === GamePhase.GAME && state.currentTurn === 'enemy' && state.winner === null) {
            const timer = setTimeout(() => {
                const alreadyShot = Object.keys(state.playerBoard.hits);
                const possibleShots = [];

                // Генеруємо всі можливі клітинки, які ще не були обстріляні
                for(let c = 0; c < GRID_SIZE; c++) {
                    for(let r = 1; r <= GRID_SIZE; r++) {
                        const coord = `${LETTERS[c]}${r}`;
                        if (!alreadyShot.includes(coord)) {
                            possibleShots.push(coord);
                        }
                    }
                }

                if (possibleShots.length > 0) {
                    const randomIndex = Math.floor(Math.random() * possibleShots.length);
                    const enemyShotCoord = possibleShots[randomIndex];

                    // Бот стріляє
                    takeShot(enemyShotCoord, 'enemy');
                }
            }, 1000); // Затримка 1 секунда для кращого UX

            return () => clearTimeout(timer);
        }
    }, [state.phase, state.currentTurn, state.playerBoard.hits, takeShot]);


    // Експортуємо всі функції-дії (actions)
    const actions = useMemo(() => ({
        takeShot,
        startGame: (playerShips) => dispatch({ type: 'START_GAME_WITH_SHIPS', payload: playerShips }),
        startPlacement: () => dispatch({ type: 'SET_PHASE', payload: 'placement' }),
        showRules: () => dispatch({ type: 'SET_PHASE', payload: 'rules' }),
        hideRules: () => dispatch({ type: 'SET_PHASE', payload: 'start' }),
        surrender: () => dispatch({ type: 'SURRENDER', payload: 'player' }),
        restartGame: () => dispatch({ type: 'RESTART_GAME' }),
    }), [takeShot]);

    return [state, actions, GamePhase];
}
