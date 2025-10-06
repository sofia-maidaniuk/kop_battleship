import React from "react";
import "./styles/Grid.css";

const LETTERS = ["А", "Б", "В", "Г", "Д"];

export function Grid({ ships = [] }) {
    const size = 5;

    const occupied = new Set(ships.flat());

    return (
        <div className="grid-wrapper">
            {/* верхні літери */}
            <div className="letters-row">
                <div className="corner" />
                {LETTERS.map((l) => (
                    <div key={l} className="label">{l}</div>
                ))}
            </div>

            {/* рядки з цифрами + клітинками */}
            <div className="grid-area">
                {Array.from({ length: size }).map((_, r) => (
                    <div key={r} className="row">
                        <div className="label">{r + 1}</div>
                        {Array.from({ length: size }).map((__, c) => {
                            const coord = `${LETTERS[c]}${r + 1}`; // напр. "В3"
                            const isShip = occupied.has(coord);
                            return <div key={coord} className={`cell${isShip ? " ship" : ""}`} />;
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
