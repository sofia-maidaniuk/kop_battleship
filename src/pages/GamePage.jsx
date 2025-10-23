import React from "react";
import "../styles/GamePage.css";
import { Grid } from "../components/Grid";

export function GamePage({
                             onSurrender, //функція переходу
                             currentTurn, // 'player' або 'enemy'
                             playerBoard, // { ships, hits } гравця
                             enemyBoard,  // { ships, hits } ворога
                             actions // { takeShot }
                         }) {
    const isPlayerTurn = currentTurn === 'player';

    // Обробка кліку на ворожому полі
    const handleEnemyCellClick = (coord) => {
        // Постріл дозволено лише у свій хід
        if (!isPlayerTurn) {
            return;
        }
        actions.takeShot(coord, 'player');
    };

    return (
        <div className="game-page full-page">
            <div className="top-bar">
                <h1>Морський бій</h1>
                {/* Здається гравець, тому викликаємо onSurrender */}
                <button className="btn" onClick={onSurrender}>
                    Здатися
                </button>
            </div>

            <div className="turn-indicator">
                <div className={`player-label ${isPlayerTurn ? "active" : ""}`}>
                    Player (Ваш хід)
                </div>
                <div className={`turn-arrow ${!isPlayerTurn ? "enemy-turn-arrow" : ""}`}>➡</div>

                <div className={`enemy-label ${!isPlayerTurn ? "active" : ""}`}>
                    Enemy (Хід бота)
                </div>
            </div>

            {/* Ігрові поля */}
            <div className="boards-container">
                <div className="board-section">
                    <h2>Моє поле</h2>
                    {/* Моє поле: показуємо кораблі, Hits - від пострілів ворога */}
                    <Grid
                        ships={playerBoard.ships}
                        showShips={true}
                        isEnemy={false}
                        cellStates={playerBoard.hits}
                        onCellClick={undefined} // Своє поле не клікабельне
                    />
                </div>

                <div className="board-section">
                    <h2>Вороже поле</h2>
                    {/* Вороже поле: кораблі приховані, відображаємо наші постріли */}
                    <Grid
                        ships={enemyBoard.ships}
                        showShips={false} // Кораблі ворога приховані
                        isEnemy={true}
                        cellStates={enemyBoard.hits} // Відображаємо наші постріли
                        onCellClick={handleEnemyCellClick} // Обробка пострілу гравця
                    />
                </div>
            </div>
        </div>
    );
}
