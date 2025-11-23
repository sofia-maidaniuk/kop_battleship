import React from "react";
import "./StartPage.css";

export function StartPage({ onStart, onShowRules }) {
    return (
        <div className="full-page">
            <h1>Морський бій</h1>
            <div className="buttons">
                <button className="btn" onClick={onStart}>Почати гру</button>
                <button className="btn" onClick={onShowRules}>Правила гри</button>
            </div>
        </div>
    );
}
