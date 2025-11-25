import { AppRouter } from "./routes/AppRouter";
import { useSelector, useDispatch } from "react-redux";
import { botTurn } from "./store/gameSlice";
import { useEffect } from "react";

function App() {
    const dispatch = useDispatch();

    // стан гри
    const game = useSelector((state) => state.game);

    // генеруємо userId
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = Math.floor(Math.random() * 10).toString();
        localStorage.setItem("userId", userId);
    }

    // логіка ходу бота
    useEffect(() => {
        if (game.currentTurn === "enemy" && game.phase === "game" && !game.winner) {
            dispatch(botTurn());
        }
    }, [game.currentTurn, game.phase, game.winner, dispatch]);

    return (
        <div className="app-container">
            <AppRouter state={game} userId={userId} />
        </div>
    );
}

export default App;
