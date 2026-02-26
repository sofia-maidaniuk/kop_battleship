/**
 * @module Pages/Placement
 * @description Сторінка інтерактивного розставлення кораблів гравцем.
 * Координує роботу кастомного хука розміщення, ігрової сітки та панелі керування.
 * Забезпечує візуальний зворотний зв'язок (повідомлення) та перехід до фази активного бою.
 */

import React, { useState } from "react";
import { Grid } from "../components/Grid";
import { ShipPlacementControls } from "../components/ShipPlacementControls";
import styles from "./ShipPlacementPage.module.css";
import { generateAutoPlacement } from "../utils/shipUtils";
import { usePlayerPlacement } from "../hook/usePlayerPlacement";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startGameWithShips } from "../store/gameSlice";

/**
 * Компонент сторінки розміщення кораблів.
 * * @component
 * @description Виконує роль "розумного" контейнера, який:
 * - Керує станом текстових повідомлень (успіх/помилка).
 * - Обробляє автоматичну та ручну розстановку.
 * - Передає дані про розміщені кораблі в Redux Store при старті бою.
 * * @returns {JSX.Element} Рендерить інтерфейс підготовки до гри.
 */
export function ShipPlacementPage() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const dispatch = useDispatch();

    /** * Деструктуризація методів та станів з хука керування розміщенням.
     * Отримує все: від списку кораблів до стану прев'ю під курсором.
     */
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

    /** Стан для відображення короткочасних повідомлень. @type {Array} */
    const [message, setMessage] = useState("");

    /**
     * Відображає повідомлення на екрані та автоматично приховує його через 3 секунди.
     * @function showMessage
     * @param {string} text - Текст повідомлення.
     * @param {boolean} [isSuccess=false] - Тип повідомлення (успіх або помилка).
     * @returns {boolean} Повертає статус успішності.
     */
    const showMessage = (text, isSuccess = false) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 3000);
        return isSuccess;
    };

    /**
     * Обробник для автоматичного заповнення поля кораблями.
     * Використовує утиліту випадкової генерації.
     */
    const handleAutoPlacement = () => {
        const newShips = generateAutoPlacement();
        setShips(newShips);
        showMessage("Кораблі успішно розміщено автоматично!", true);
    };

    /**
     * Повністю очищує ігрове поле.
     */
    const handleReset = () => {
        resetPlacement();
        showMessage("Розміщення кораблів скинуто.", false);
    };

    /**
     * Обробляє спробу розміщення корабля при кліку на клітинку.
     * @param {string} coord - Координата цілі (напр. "А1").
     */
    const handleCellClick = (coord) => {
        const result = placeShip(coord);
        showMessage(result.message, result.success);
    };

    /**
     * Перевіряє готовність флоту та ініціює перехід до фази бою.
     * Записує фінальну розстановку в Redux.
     */
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

            {/* Блок сповіщень */}
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
                {/* Ігрова сітка з підтримкою подій миші */}
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

                {/* Панель керування вибором кораблів */}
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
