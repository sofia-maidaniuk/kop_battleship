import { Grid } from './Grid';

// Конфігурація компонента
export default {
    title: 'Components/Комплексні/Grid',
    component: Grid,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],

    // КОНФІГУРАЦІЯ ВЛАСТИВОСТЕЙ
    argTypes: {
        isEnemy: {
            control: 'boolean',
            description: 'Чи це поле ворога (впливає на стилі і відображення)',
        },
        showShips: {
            control: 'boolean',
            description: 'Чи показувати кораблі (завжди false для ворога, поки корабель не потоплено)',
        },
        isHoverValid: {
            control: 'boolean',
            description: 'Чи є валідним поточне місце для встановлення корабля (прев\'ю)',
        },
        onCellClick: { action: 'onCellClick' },
        onCellHover: { action: 'onCellHover' },
    },
};

// ВАРІАЦІЇ КОМПОНЕНТА

// Варіація 1: Порожнє ігрове поле (початок гри)
export const EmptyGrid = {
    args: {
        ships: [],
        cellStates: {},
        isEnemy: false,
        showShips: true,
        previewPositions: [],
        isHoverValid: false,
    },
};

// Варіація 2: Розстановка ДОЗВОЛЕНА (зелене прев'ю, всі умови гуд)
export const PlacementValid = {
    args: {
        ships: [
            { id: 1, positions: ['А1', 'А2'] } // Корабель стоїть у кутку
        ],
        cellStates: {},
        isEnemy: false,
        showShips: true,
        // Наводимо мишку далеко від інших кораблів
        previewPositions: ['Д4', 'Д5'],
        isHoverValid: true, // Вмикає зелений колір (previewValid)
    },
};

// Варіація 3: Розстановка ЗАБОРОНЕНА (червоне прев'ю, торкається гранями)
export const PlacementInvalid = {
    args: {
        ships: [
            { id: 1, positions: ['В2', 'В3'] } // Корабель стоїть по центру
        ],
        cellStates: {},
        isEnemy: false,
        showShips: true,
        // Наводимо мишку впритул до існуючого корабля (порушення правил!)
        previewPositions: ['Б2', 'Б3'],
        isHoverValid: false, // Вмикає червоний колір (previewInvalid)
    },
};

// Варіація 4: Гравець у грі (всі 5 кораблів розставлені за правилами)
export const PlayerInGame = {
    args: {
        ships: [
            { id: 1, positions: ['А1', 'А2'] },
            { id: 2, positions: ['В1'] },
            { id: 3, positions: ['Д2', 'Д3'] },
            { id: 4, positions: ['А5', 'Б5'] },
            { id: 5, positions: ['Г5'] },
        ],
        cellStates: {
            'А1': 'hit',
            'Д5': 'miss'
        },
        isEnemy: false,
        showShips: true,
        previewPositions: [],
        isHoverValid: false,
    },
};

// Варіація 5: Вороже поле в розпалі бою (кораблі приховані)
export const EnemyBattlefield = {
    args: {
        ships: [
            { id: 1, positions: ['Б2', 'Б3'] },
        ],
        cellStates: {
            'А1': 'miss',
            'Г5': 'miss',
            'Б2': 'hit',
            'В4': 'sunk',
            'В5': 'sunk',
        },
        isEnemy: true,
        showShips: false,
        previewPositions: [],
    },
};
