import React, { useState } from "react";
import { Grid } from "../components/Grid";
import { ShipPlacementControls } from "../components/ShipPlacementControls";
import styles from "./ShipPlacementPage.module.css";
import { generateAutoPlacement } from "../utils/shipUtils";
import { usePlayerPlacement } from "../hook/usePlayerPlacement";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startGameWithShips } from "../store/gameSlice";

export function ShipPlacementPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    const {
        ships,
        placeShip,
        toggleOrientation,
        selectedShipSize,
        setSelectedShipSize,
        orientation,
        canStartBattle,
        resetPlacement,
        placedShipCounts,
        setShips,
        previewShipPositions,
        isPreviewValid,
        handleCellHover,
    } = usePlayerPlacement();

    const [message, setMessage] = useState("");

    const showMessage = (text, isSuccess = false) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 3000);
        return isSuccess;
    };

    const handleAutoPlacement = () => {
        const newShips = generateAutoPlacement();
        setShips(newShips);
        showMessage("Кораблі успішно розміщено автоматично!", true);
    };

    const handleReset = () => {
        resetPlacement();
        showMessage("Розміщення кораблів скинуто.", false);
    };

    const handleCellClick = (coord) => {
        const result = placeShip(coord);
        showMessage(result.message, result.success);
    };

    const handleStartBattleClick = () => {
        if (!canStartBattle) {
            showMessage("Розставте всі кораблі перед початком бою.", false);
            return;
        }

        // Redux старт гри з кораблями
        dispatch(startGameWithShips(ships));

        navigate(`/user/${userId}/game`);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Розставлення кораблів</h1>

            <div className={styles.messageWrapper}>
                {message && (
                    <div
                        className={`${styles.message} ${
                            message.includes("успішно")
                                ? styles.success
                                : styles.error
                        }`}
                    >
                        {message}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div
                    className={styles.gridContainer}
                    onMouseLeave={() => handleCellHover(null)}
                >
                    <Grid
                        ships={ships}
                        showShips={true}
                        isEnemy={false}
                        onCellClick={handleCellClick}
                        onCellHover={handleCellHover}
                        previewPositions={previewShipPositions}
                        isHoverValid={isPreviewValid}
                    />
                </div>

                <div className={styles.controlsPanel}>
                    <ShipPlacementControls
                        selectedShipSize={selectedShipSize}
                        setSelectedShipSize={setSelectedShipSize}
                        orientation={orientation}
                        toggleOrientation={toggleOrientation}
                        placedShipCounts={placedShipCounts}
                        onAutoPlacement={handleAutoPlacement}
                        onReset={handleReset}
                    />
                </div>
            </div>

            <div className={styles.buttons}>
                <button
                    className={`${styles.btn} ${styles.back}`}
                    onClick={() => navigate(`/user/${userId}/settings`)}
                >
                    Назад
                </button>

                <button
                    className={`${styles.btn} ${styles.start}`}
                    onClick={handleStartBattleClick}
                >
                    Почати бій
                </button>
            </div>
        </div>
    );
}
