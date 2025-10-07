import React from "react";
import "../styles/Grid.css";
import { GRID_SIZE, LETTERS } from "../constants/gameConstants";
import { Cell } from "./Cell.jsx";

export function Grid({
                         ships = [],
                         onCellClick,
                         showShips = true,
                         isEnemy = false,
                         cellStates = {},
                     }) {
    const size = GRID_SIZE;

    // координати, зайняті кораблями (але показуємо тільки якщо showShips=true)
    const occupied = new Set(showShips ? ships.flatMap((s) => s.positions) : []);

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

                            return (
                                <Cell
                                    key={coord}
                                    coord={coord}
                                    hasShip={hasShip}
                                    isEnemy={isEnemy}
                                    state={state}
                                    onClick={onCellClick}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
