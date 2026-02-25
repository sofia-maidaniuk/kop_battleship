import { AppRouter } from "./routes/AppRouter";
import { GdprConsent } from "./components/GdprConsent";
import { getCookieConsentValue } from "react-cookie-consent";

function App() {
    let userId = localStorage.getItem("userId");

    // Перевіряємо, чи дав користувач згоду
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
            <AppRouter userId={userId} />
            <GdprConsent />
        </div>
    );
}

export default App;
