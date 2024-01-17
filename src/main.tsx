import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import TitleBar from "./components/TitleBar";
import { RouterProvider } from "react-router-dom";
import Router from "@app/routes";
import { invoke } from "@tauri-apps/api/tauri";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query";
import { DialogProvider } from "./dialogs/DialogProvider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorScreen, onError } from "./routes/ErrorScreen";
import { error as LogError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";
import LoadingScreen from "./components/LoadingScreen";

enum LoadingState {
    "LOADING",
    "FADE_OUT",
    "DONE"
}

window.addEventListener("error", event => {
    LogError(JSON.stringify(serializeError(event)));
});

const App: React.FC = () => {
    const [loading, setLoading] = useState(LoadingState.LOADING);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        (async () => {
            try {
                await invoke("init");

                // Add a tiny bit of delay so the loading screen doesn't just instantly disappear
                await new Promise(r => setTimeout(r, 250));
            } catch (e) {
                console.error(e);
                LogError(JSON.stringify(serializeError(e)));

                // If there's an error, just instantly hide the loading screen
                setError(e);
                setLoading(LoadingState.DONE);

                return;
            }

            // The loading screen takes 250ms to fade out
            setLoading(LoadingState.FADE_OUT);
            await new Promise(r => setTimeout(r, 250));

            // Done!
            setLoading(LoadingState.DONE);
        })();
    }, []);

    // Show error screen
    if (error) {
        return <React.StrictMode>
            <TitleBar />
            <p>
                A fatal error has occurred when attempted to initalize the launcher.
                Please report this to our Discord or GitHub immediately.
            </p>
            <p>
                {error instanceof Error ? error.message : JSON.stringify(serializeError(error))}
            </p>
        </React.StrictMode>;
    }

    // Show main screen
    return <React.StrictMode>
        {loading != LoadingState.DONE &&
            <LoadingScreen fadeOut={loading == LoadingState.FADE_OUT} />
        }

        <ErrorBoundary FallbackComponent={ErrorScreen} onError={onError}>
            <DialogProvider>
                <TitleBar />
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={Router} />
                </QueryClientProvider>
            </DialogProvider>
        </ErrorBoundary>
    </React.StrictMode>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);