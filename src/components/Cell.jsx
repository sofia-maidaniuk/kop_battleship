import React from "react";
import "../styles/Cell.css";

export const Cell = React.memo(function Cell({
    coord,
    hasShip= false,
    isEnemy = false,
    state = "empty",
    onClick, }) {
    // захист від випадкового undefined coord
    if (coord === undefined) return null;

    const className = [
        "cell",
        isEnemy ? "enemy-cell" : "ally-cell",
        hasShip ? "ship" : "",
        state === "hit" ? "hit" : "",
        state === "miss" ? "miss" : "",
        state === "sunk" ? "sunk" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={className}
            onClick={onClick ? () => onClick(coord) : undefined}
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
            aria-label={`Клітинка ${coord}${hasShip ? ", містить корабель" : ""}, стан: ${state}`}
        />
    );
});
