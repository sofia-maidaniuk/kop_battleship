import React from "react";
import "../styles/Grid.css";
import { GRID_SIZE, LETTERS } from "../constants/gameConstants";
import { Cell } from "./Cell.jsx";

export function Grid({
                         ships = [],
                         onCellClick,
                         onCellHover, //обробка при наведені
                         previewPositions = [], // позиції для прев'ю
                         isHoverValid = false, //валідність прев'ю
                         showShips = true,
                         isEnemy = false,
                         cellStates = {},
                     }) {
    const size = GRID_SIZE;

    // координати, зайняті кораблями (але показуємо тільки якщо showShips=true)
    const occupied = new Set(showShips ? ships.flatMap((s) => s.positions) : []);
    // Новий Set для швидкої перевірки, чи клітинка є частиною прев'ю
    const previewSet = new Set(previewPositions);

    return (
        <div className={`grid-wrapper ${isEnemy ? "enemy" : "ally"}`}>
            {/* верхні літери */}
            <div className="letters-row">
                <div className="corner" />
                {LETTERS.map((l) => (
                    <div key={l} className="label">{l}</div>
                ))}
            </div>

            {/* рядки */}
            <div className="grid-area">
                {Array.from({ length: size }).map((_, r) => (
                    <div key={r} className="row">
                        <div className="label">{r + 1}</div>
                        {Array.from({ length: size }).map((__, c) => {
                            const coord = `${LETTERS[c]}${r + 1}`;
                            const hasShip = occupied.has(coord);
                            const state = cellStates[coord] ?? "empty";

                            // Визначення класів для візуального прев'ю
                            const isPreview = previewSet.has(coord);
                            const previewClass = isPreview
                                ? (isHoverValid ? "preview-valid" : "preview-invalid")
                                : "";

                            return (
                                <Cell
                                    key={coord}
                                    coord={coord}
                                    hasShip={hasShip}
                                    isEnemy={isEnemy}
                                    state={state}
                                    onClick={onCellClick}
                                    onMouseEnter={onCellHover ? () => onCellHover(coord) : undefined} // Передача hover
                                    onMouseLeave={onCellHover ? () => onCellHover(null) : undefined} // Обробка виходу
                                    extraClass={previewClass} // Додатковий клас для прев'ю
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
