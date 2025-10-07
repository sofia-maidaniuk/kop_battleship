import React, { useState } from "react";
import { StartPage } from "./pages/StartPage";
import { GamePage } from "./pages/GamePage";
import { ShipPlacementPage } from "./pages/ShipPlacementPage";
import { RulesPage } from "./pages/RulesPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
    const [page, setPage] = useState("start");

    return (
        <>
            {page === "start" && (
                <StartPage
                    onStart={() => setPage("placement")}
                    onShowRules={() => setPage("rules")}
                />
            )}

            {page === "placement" && (
                <ShipPlacementPage
                    onStartBattle={() => setPage("game")}
                    onBack={() => setPage("start")}
                />
            )}

            {page === "game" && (
                <GamePage onSurrender={() => setPage("result")} />
            )}

            {page === "rules" && (
                <RulesPage onBack={() => setPage("start")} />
            )}

            {page === "result" && (
                <ResultPage onBackToStart={() => setPage("start")} />
            )}
        </>
    );
}

export default App;
