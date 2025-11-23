import React from "react";
import styles from "./Grid.module.css";
import { GRID_SIZE, LETTERS } from "../constants/gameConstants";
import { Cell } from "./Cell.jsx";

export function Grid({
                         ships = [],
                         onCellClick,
                         onCellHover,
                         previewPositions = [],
                         isHoverValid = false,
                         showShips = true,
                         isEnemy = false,
                         cellStates = {},
                     }) {
    const size = GRID_SIZE;

    const occupied = new Set(showShips ? ships.flatMap((s) => s.positions) : []);
    const previewSet = new Set(previewPositions);

    return (
        <div className={`${styles.wrapper} ${isEnemy ? styles.enemy : styles.ally}`}>

            {/* верхні літери */}
            <div className={styles.lettersRow}>
                <div className={styles.corner} />
                {LETTERS.map((l) => (
                    <div key={l} className={styles.label}>{l}</div>
                ))}
            </div>

            {/* рядки */}
            <div className={styles.gridArea}>
                {Array.from({ length: size }).map((_, r) => (
                    <div key={r} className={styles.row}>

                        <div className={styles.label}>{r + 1}</div>

                        {Array.from({ length: size }).map((__, c) => {
                            const coord = `${LETTERS[c]}${r + 1}`;
                            const hasShip = occupied.has(coord);
                            const state = cellStates[coord] ?? "empty";

                            const isPreview = previewSet.has(coord);
                            const previewClass = isPreview
                                ? (isHoverValid ? "previewValid" : "previewInvalid")
                                : "";

                            return (
                                <Cell
                                    key={coord}
                                    coord={coord}
                                    hasShip={hasShip}
                                    isEnemy={isEnemy}
                                    state={state}
                                    onClick={onCellClick}
                                    onMouseEnter={onCellHover ? () => onCellHover(coord) : undefined}
                                    onMouseLeave={onCellHover ? () => onCellHover(null) : undefined}
                                    extraClass={previewClass}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
