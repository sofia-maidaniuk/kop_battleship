import { AppRouter } from "./routes/AppRouter";

function App() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = Math.floor(Math.random() * 10).toString();
        localStorage.setItem("userId", userId);
    }

    return (
        <div className="app-container">
            <AppRouter userId={userId} />
        </div>
    );
}

export default App;
