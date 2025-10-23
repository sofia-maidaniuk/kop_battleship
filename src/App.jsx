import React from "react";
// Імпортуємо головний хук та всі компоненти сторінок
import { useBattleshipGame } from '../src/hook/useBattleshipGame.jsx';
import { StartPage } from "./pages/StartPage";
import { GamePage } from "./pages/GamePage";
import { ShipPlacementPage } from "./pages/ShipPlacementPage";
import { RulesPage } from "./pages/RulesPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
    // ВИКОРИСТАННЯ ГЛОБАЛЬНОГО СТАНУ (useReducer)
    // state: містить phase, currentTurn, playerBoard, enemyBoard, winner
    // actions: містить takeShot, startGame, surrender, startPlacement, etc.
    const [state, actions, GamePhase] = useBattleshipGame();

    // Об'єднання функцій навігації для чистої передачі дочірнім елементам
    const navActions = {
        onStart: actions.startPlacement,       // START -> PLACEMENT
        onShowRules: actions.showRules,        // START -> RULES
        onBack: actions.hideRules,             // RULES -> START
        onSurrender: actions.surrender,        // GAME -> RESULT
        onBackToStart: actions.restartGame,    // RESULT -> START (зі скиданням стану)
    };

    let Content;

    // РОУТИНГ НА ОСНОВІ ФАЗИ ГРИ (state.phase)
    switch (state.phase) {
        case GamePhase.START:
            Content = <StartPage onStart={navActions.onStart} onShowRules={navActions.onShowRules} />;
            break;

        case GamePhase.PLACEMENT:
            Content = (
                <ShipPlacementPage
                    // Передаємо кораблі, які були розміщені користувачем, у центральний хук
                    onStartBattle={(ships) => actions.startGame(ships)}
                    onBack={navActions.onBackToStart}
                />
            );
            break;

        case GamePhase.GAME:
            // Передаємо GamePage лише необхідні props (
            Content = (
                <GamePage
                    onSurrender={navActions.onSurrender}
                    currentTurn={state.currentTurn}
                    playerBoard={state.playerBoard}
                    enemyBoard={state.enemyBoard}
                    actions={actions} // { takeShot }
                />
            );
            break;

        case GamePhase.RULES:
            Content = <RulesPage onBack={navActions.onBack} />;
            break;

        case GamePhase.RESULT:
            Content = (
                <ResultPage
                    onBackToStart={navActions.onBackToStart}
                    winner={state.winner} // Передаємо переможця
                />
            );
            break;

        default:
            Content = <StartPage {...navActions} />;
            break;
    }

    return (
        <div className="app-container">
            {Content}
        </div>
    );
}

export default App;
