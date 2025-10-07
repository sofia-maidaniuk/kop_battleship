import React, { useState } from "react";
import "../styles/ShipPlacementControls.css";

export function ShipPlacementControls() {
    const [selectedShip, setSelectedShip] = useState(3);
    const [orientation, setOrientation] = useState("horizontal");

    const toggleOrientation = () => {
        setOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
    };

    return (
        <div className="ship-controls">
            <div className="ship-types">
                <span>Оберіть корабель:</span><br/>
                <div className={'ship-buttons-row'}>
                    <button
                        className={`btn ship-btn ${selectedShip === 3 ? "active" : ""}`}
                        onClick={() => setSelectedShip(3)}
                    >
                        3-палубний
                    </button>
                    <button
                        className={`btn ship-btn ${selectedShip === 2 ? "active" : ""}`}
                        onClick={() => setSelectedShip(2)}
                    >
                        2-палубний
                    </button>
                    <button
                        className={`btn ship-btn ${selectedShip === 1 ? "active" : ""}`}
                        onClick={() => setSelectedShip(1)}
                    >
                        1-палубний
                    </button>
                </div>
            </div>

            <button className="btn" onClick={toggleOrientation}>
                🔄 {orientation === "horizontal" ? "Горизонтальна" : "Вертикальна"}
            </button>

        </div>
    );
}
