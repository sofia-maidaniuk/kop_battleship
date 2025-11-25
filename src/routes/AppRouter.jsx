import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { StartPage } from "../pages/StartPage";
import { SettingsPage } from "../pages/SettingsPage";
import { ShipPlacementPage } from "../pages/ShipPlacementPage";
import { GamePage } from "../pages/GamePage";
import { RulesPage } from "../pages/RulesPage";
import { setPhase, startGameWithShips, GamePhase } from "../store/gameSlice";

export function AppRouter({ userId }) {
    const dispatch = useDispatch();

    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to={`/user/${userId}/start`} replace />}
            />

            <Route
                path="/user/:userId/start"
                element={
                    <StartPage
                        onStart={() => dispatch(setPhase(GamePhase.SETTINGS))}
                        onShowRules={() => dispatch(setPhase(GamePhase.RULES))}
                    />
                }
            />

            <Route
                path="/user/:userId/settings"
                element={<SettingsPage />}
            />

            <Route
                path="/user/:userId/placement"
                element={
                    <ShipPlacementPage
                        onStartBattle={(ships) => {
                            dispatch(startGameWithShips(ships));
                        }}
                    />
                }
            />

            <Route
                path="/user/:userId/game"
                element={<GamePage />}
            />

            <Route
                path="/user/:userId/rules"
                element={<RulesPage />}
            />

            <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
    );
}
