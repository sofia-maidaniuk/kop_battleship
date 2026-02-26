/**
 * @module Routes/AppRouter
 * @description Головний компонент маршрутизації додатка Battleship.
 * Визначає всі доступні шляхи (маршрути) та пов'язує їх із відповідними сторінками.
 * Використовує динамічні параметри (:userId) для ізоляції сесій гравців.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { StartPage } from "../pages/StartPage";
import { SettingsPage } from "../pages/SettingsPage";
import { ShipPlacementPage } from "../pages/ShipPlacementPage";
import { GamePage } from "../pages/GamePage";
import { RulesPage } from "../pages/RulesPage";
import { ResultsPage } from "../pages/ResultsPage";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { setPhase, startGameWithShips, GamePhase } from "../store/gameSlice";

/**
 * Компонент AppRouter.
 * * @component
 * @param {Object} props - Властивості компонента.
 * @param {string} props.userId - Унікальний ідентифікатор користувача, отриманий із сесії або localStorage.
 * @returns {JSX.Element} Конфігурація маршрутів React Router.
 */
export function AppRouter({ userId }) {
    const dispatch = useDispatch();

    return (
        <Routes>
            {/* Редирект із кореневого шляху на стартову сторінку конкретного користувача */}
            <Route
                path="/"
                element={<Navigate to={`/user/${userId}/start`} replace />}
            />

            {/* Стартовий екран гри */}
            <Route
                path="/user/:userId/start"
                element={
                    <StartPage
                        onStart={() => dispatch(setPhase(GamePhase.SETTINGS))}
                        onShowRules={() => dispatch(setPhase(GamePhase.RULES))}
                    />
                }
            />

            {/* Сторінка налаштувань (складність, час тощо) */}
            <Route
                path="/user/:userId/settings"
                element={<SettingsPage />}
            />

            {/* Етап розстановки флоту */}
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

            {/* Основний ігровий процес (битва) */}
            <Route
                path="/user/:userId/game"
                element={<GamePage />}
            />

            {/* Інструкції та правила гри */}
            <Route
                path="/user/:userId/rules"
                element={<RulesPage />}
            />

            {/* Сторінка фінальних результатів */}
            <Route
                path="/user/:userId/results"
                element={<ResultsPage />}
            />

            {/* Глобальна сторінка Політики конфіденційності (GDPR) */}
            <Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
            />

            {/* Обробка неіснуючих сторінок (404) */}
            <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
    );
}
