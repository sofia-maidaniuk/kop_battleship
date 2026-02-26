/**
 * @module Entry/Main
 * @description Головна точка входу (Entry Point) додатку "Морський бій".
 * Відповідає за ініціалізацію React-дерева та підключення глобальних провайдерів:
 * Redux (для управління станом), React Router (для маршрутизації) та
 * StrictMode (для виявлення потенційних проблем у коді).
 */

import React from "react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";
import './global.css';

/**
 * Знаходить кореневий DOM-елемент (div id="root" у index.html)
 * та монтує в нього весь React-додаток із необхідними обгортками (Providers).
 */
createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* Підключення глобального сховища стану (Redux Store) */}
        <Provider store={store}>
            {/* Підключення системи маршрутизації (React Router) */}
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
