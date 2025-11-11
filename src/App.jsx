import React from "react";
import { useBattleshipGame } from '../src/hook/useBattleshipGame.jsx';
import { StartPage } from "./pages/StartPage";
import { SettingsPage } from "./pages/SettingsPage";
import { GamePage } from "./pages/GamePage";
import { ShipPlacementPage } from "./pages/ShipPlacementPage";
import { RulesPage } from "./pages/RulesPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
    const [state, actions, GamePhase] = useBattleshipGame();

    const navActions = {
        onStart: actions.openSettings,          // START SETTINGS
        onShowRules: actions.showRules,         // START RULES
        onBack: actions.hideRules,              // RULES START
        onSurrender: actions.surrender,         // GAME RESULT
        onBackToStart: actions.restartGame,     // RESULT START
    };

    let Content;

    switch (state.phase) {
        case GamePhase.START:
            Content = (
                <StartPage
                    onStart={navActions.onStart}
                    onShowRules={navActions.onShowRules}
                />
            );
            break;

        case GamePhase.SETTINGS:
            Content = (
                <SettingsPage
                    onStart={() => actions.startPlacement()} // після вибору рівня розстановка кораблів
                    onBack={() => actions.hideRules()}
                />
            );
            break;

        case GamePhase.PLACEMENT:
            Content = (
                <ShipPlacementPage
                    onStartBattle={(ships) => actions.startGame(ships)}
                    onBack={() => actions.openSettings()}
                />
            );
            break;

        case GamePhase.GAME:
            Content = (
                <GamePage
                    onSurrender={navActions.onSurrender}
                    currentTurn={state.currentTurn}
                    playerBoard={state.playerBoard}
                    enemyBoard={state.enemyBoard}
                    actions={actions}
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
                    winner={state.winner}
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
