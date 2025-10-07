export const createShip = (positions, orientation = "horizontal", type) => ({
    id: Math.random().toString(36).slice(2, 9),
    positions,
    orientation,
    type,
    hits: [],
});

// Швидка генерація автопостановки (5×5 макет)
export const generateAutoPlacement = () => ([
    // 3-палубний (вертикально)
    createShip(["А1", "А2", "А3"], "vertical", 3),
    // 2-палубний (вертикально)
    createShip(["В1", "В2"], "vertical", 2),
    // 1-палубні
    createShip(["Д1"], "horizontal", 1),
    createShip(["Д3"], "horizontal", 1),
]);
