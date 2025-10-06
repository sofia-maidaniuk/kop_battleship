import React, { useState } from "react";
import { StartPage } from "./pages/StartPage";
import { GamePage } from "./pages/GamePage";

function App() {
    const [page, setPage] = useState("start");

    return (
        <>
            {page === "start" && <StartPage onStart={() => setPage("game")} />}
            {page === "game" && <GamePage />}
        </>
    );
}

export default App;
