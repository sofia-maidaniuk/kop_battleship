/**
 * @module App
 * @description Кореневий компонент додатку "Морський бій".
 * Ініціалізує унікальний ідентифікатор користувача (userId) та керує
 * маршрутизацією на основі згоди користувача (GDPR).
 */

import { AppRouter } from "./routes/AppRouter";
import { GdprConsent } from "./components/GdprConsent";
import { getCookieConsentValue } from "react-cookie-consent";

/**
 * Головний компонент App.
 * * @component
 * @description Виконує базове налаштування сесії:
 * 1. Перевіряє наявність збереженого `userId`.
 * 2. Перевіряє статус згоди на використання cookies/localStorage.
 * 3. Генерує новий `userId` для поточної сесії, але записує його в
 * постійну пам'ять (localStorage) ТІЛЬКИ у разі наявності згоди користувача.
 * * @returns {JSX.Element} Рендерить контейнер із маршрутизатором (AppRouter) та банером згоди (GdprConsent).
 */
function App() {
    /** @type {string|null} Унікальний ідентифікатор користувача зі сховища */
    let userId = localStorage.getItem("userId");

    /** @type {boolean} Прапор, що підтверджує згоду користувача на обробку даних */
    const hasConsent = getCookieConsentValue("battleship-gdpr-consent") === "true";

    if (!userId) {
        // Генеруємо ID в пам'яті, щоб передати його в роутер
        userId = Math.floor(Math.random() * 10).toString();

        // ЗАПИСУЄМО В СХОВИЩЕ ТІЛЬКИ ЯКЩО Є ЗГОДА
        if (hasConsent) {
            localStorage.setItem("userId", userId);
        }
    }

    return (
        <div className="app-container">
            {/* Передаємо згенерований або відновлений ID у систему маршрутизації */}
            <AppRouter userId={userId} />

            {/* Глобальний компонент запиту згоди GDPR */}
            <GdprConsent />
        </div>
    );
}

export default App;
