import React from "react";
import "../styles/Cell.css";
import { Ship } from "./Ship";

export function Cell({ ship }) {
    return (
        <div className="cell">
            {ship && <Ship length={ship.length} orientation={ship.orientation} />}
        </div>
    );
}
