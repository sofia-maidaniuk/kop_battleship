/**
 * @module Components/Compliance
 * @description Модуль для забезпечення відповідності вимогам GDPR (General Data Protection Regulation).
 * Містить логіку запиту згоди на використання локального сховища (LocalStorage) та Cookies.
 */

import React from "react";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

/**
 * Компонент GdprConsent.
 * * @component
 * @description Рендерить інтерактивний банер згоди у нижній частині екрана.
 * Використовує стратегію "Hard Wall" через параметр `overlay`, що блокує взаємодію
 * з грою до прийняття рішення користувачем.
 * * Основні функції:
 * - Запит дозволу на збереження прогресу, таймерів та історії.
 * - Надання посилання на повну Політику конфіденційності.
 * - Примусове оновлення сторінки (`window.location.reload()`) після вибору для миттєвої активації/деактивації сховища.
 * * @returns {JSX.Element} Компонент банера згоди з overlay-ефектом.
 */
export const GdprConsent = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Reject"
            enableDeclineButton
            cookieName="battleship-gdpr-consent"
            overlay={true}
            overlayClasses="overlay-gdpr"
            style={{ background: "#1e1e1e", alignItems: "center" }}
            buttonStyle={{
                background: "#4CAF50",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "4px",
            }}
            declineButtonStyle={{
                background: "#d32f2f",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "4px",
            }}
            expires={150}
            onAccept={() => {
                console.log("User accepted GDPR consent.");
                window.location.reload();
            }}
            onDecline={() => {
                console.log("User declined GDPR consent.");
                window.location.reload();
            }}
        >
            This application uses browser local storage to save game progress,
            timers and match history. According to GDPR requirements, we ask for
            your consent before storing this data. Read more in our{" "}
            <Link to="/privacy-policy" style={{ color: "#4CAF50", textDecoration: "underline" }}>
                Privacy Policy
            </Link>.
        </CookieConsent>
    );
};
