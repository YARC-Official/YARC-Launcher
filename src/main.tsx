import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import TitleBar from "./components/TitleBar";
import { RouterProvider } from "react-router-dom";
import Router from "@app/routes";
import { invoke } from "@tauri-apps/api/tauri";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query";
import { DownloadClientProvider } from "@app/utils/Download/provider";
import { DialogManagerProvider } from "./dialogs/DialogProvider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorScreen, onError } from "./routes/ErrorScreen";
import { error as LogError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";

window.addEventListener("error", event => {
    LogError(JSON.stringify(serializeError(event)));
});

invoke("init").then(() => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <ErrorBoundary FallbackComponent={ErrorScreen} onError={onError}>
                <DialogManagerProvider>
                    <DownloadClientProvider>
                        <TitleBar />
                        <QueryClientProvider client={queryClient}>
                            <RouterProvider router={Router} />
                        </QueryClientProvider>
                    </DownloadClientProvider>
                </DialogManagerProvider>
            </ErrorBoundary>
        </React.StrictMode>
    );
}).catch(e => {
    console.error(e);
    LogError(JSON.stringify(serializeError(e)));
    
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <TitleBar />
            <p>
                A fatal error has occurred when attempted to initalize the launcher.
                Please report this to our Discord or GitHub immediately.
            </p>
            <p>
                {e instanceof Error ? e.message : JSON.stringify(serializeError(e))}
            </p>
        </React.StrictMode>
    );
});