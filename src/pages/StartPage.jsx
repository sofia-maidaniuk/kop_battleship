import React from "react";
import "./styles/StartPage.css";

export function StartPage({ onStart }) {
    return (
        <div className="start-page">
            <h1>⚓ Морський бій</h1>
            <div className="buttons">
                <button onClick={onStart}>Почати гру</button>
                <button>Правила гри</button>
            </div>
        </div>
    );
}
