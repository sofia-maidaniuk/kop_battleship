import { AppRouter } from "./routes/AppRouter";
import { useBattleshipGame } from "./hook/useBattleshipGame";

function App() {
    const [state, actions] = useBattleshipGame();

    // Генерація userId через localStorage
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = Math.floor(Math.random() * 10).toString();
        localStorage.setItem("userId", userId);
    }

    return (
        <div className="app-container">
            <AppRouter
                state={state}
                actions={actions}
                userId={userId}
            />
        </div>
    );
}

export default App;
