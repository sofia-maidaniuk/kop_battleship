import React from "react";
import styles from "./Cell.module.css";

export const Cell = React.memo(function Cell({
                                                 coord,
                                                 hasShip = false,
                                                 isEnemy = false,
                                                 state = "empty",
                                                 onClick,
                                                 onMouseEnter,
                                                 onMouseLeave,
                                                 extraClass = "",
                                             }) {
    if (coord === undefined) return null;

    const classList = [styles.cell];

    // кораблі гравця
    if (!isEnemy && hasShip) classList.push(styles.allyShip);

    // стани
    if (state === "hit") classList.push(styles.hit);
    if (state === "miss") classList.push(styles.miss);
    if (state === "sunk") classList.push(styles.sunk);

    // прев’ю (CSS передає клас як string, тому окремо)
    if (extraClass && styles[extraClass]) {
        classList.push(styles[extraClass]);
    }

    return (
        <div
            className={classList.join(" ")}
            onClick={onClick ? () => onClick(coord) : undefined}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            onClick(coord);
                        }
                    }
                    : undefined
            }
            aria-label={`Клітинка ${coord}${
                hasShip ? ", містить корабель" : ""
            }, стан: ${state}`}
        />
    );
});
