import { AppRouter } from "./routes/AppRouter";
import { GdprConsent } from "./components/GdprConsent";

function App() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = Math.floor(Math.random() * 10).toString();
        localStorage.setItem("userId", userId);
    }

    return (
        <div className="app-container">
            <AppRouter userId={userId} />
            <GdprConsent />
        </div>
    );
}

export default App;
