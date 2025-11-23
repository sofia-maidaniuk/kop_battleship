import React from "react";
import "./StartPage.css";
import { useNavigate, useParams } from "react-router-dom";

export function StartPage({ onStart, onShowRules }) {
    const navigate = useNavigate();
    const { userId } = useParams();

    const handleStart = () => {
        onStart(); // логіка гри
        navigate(`/user/${userId}/settings`);
    };

    const handleRules = () => {
        onShowRules();
        navigate(`/user/${userId}/rules`);
    };

    return (
        <div className="full-page">
            <h1>Морський бій</h1>
            <div className="buttons">
                <button className="btn" onClick={handleStart}>Почати гру</button>
                <button className="btn" onClick={handleRules}>Правила гри</button>
            </div>
        </div>
    );
}
