import { Cell } from './Cell';

// Конфігурація компонента
export default {
    title: 'Components/Базові/Cell', // Шлях у боковому меню Storybook
    component: Cell,
    parameters: {
        layout: 'centered', // Відцентрувати компонент на екрані
    },
    // Автоматично генерує вкладку Docs на основі твоїх JSDoc коментарів!
    tags: ['autodocs'],

    // КОНФІГУРАЦІЯ ВЛАСТИВОСТЕЙ
    argTypes: {
        state: {
            control: 'select',
            options: ['empty', 'hit', 'miss', 'sunk'],
            description: 'Поточний візуальний стан клітинки',
        },
        hasShip: {
            control: 'boolean',
            description: 'Чи розміщений корабель у цій клітинці',
        },
        isEnemy: {
            control: 'boolean',
            description: 'Чи належить клітинка ворожому полю (приховує корабель)',
        },
        coord: {
            control: 'text',
            description: 'Координата клітинки (напр. "A1")',
        },
        onClick: {
            action: 'clicked', // Буде логувати кліки в панелі Actions
        },
    },
};

// ВАРІАЦІЇ КОМПОНЕНТА

// Варіація 1: Звичайна порожня клітинка
export const EmptyCell = {
    args: {
        coord: 'A1',
        state: 'empty',
        hasShip: false,
        isEnemy: false,
    },
};

// Варіація 2: Клітинка з кораблем гравця (видима)
export const PlayerShip = {
    args: {
        coord: 'B2',
        state: 'empty',
        hasShip: true,
        isEnemy: false,
    },
};

// Варіація 3: Промах (клітинка, в яку стріляли, але там пусто)
export const Missed = {
    args: {
        coord: 'C3',
        state: 'miss',
        hasShip: false,
        isEnemy: true,
    },
};

// Варіація 4: Влучання (поранений корабель, зазвичай червона)
export const HitShip = {
    args: {
        coord: 'D4',
        state: 'hit',
        hasShip: true,
        isEnemy: true,
    },
};

// Варіація 5: Потоплений корабель
export const SunkShip = {
    args: {
        coord: 'E5',
        state: 'sunk',
        hasShip: true,
        isEnemy: true,
    },
};
