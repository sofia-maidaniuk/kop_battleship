/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useSettingsState } from "../hook/useSettingsState";

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const settingsApi = useSettingsState();

    return (
        <SettingsContext.Provider value={settingsApi}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings must be used within <SettingsProvider>");
    }
    return ctx;
}
