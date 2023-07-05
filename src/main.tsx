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

let error = undefined;

try {
    await invoke("init");
} catch (e) {
    error = e as string;
    console.error(e);
}

if (!error) {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <DialogManagerProvider>
                <DownloadClientProvider>
                    <TitleBar />
                    <QueryClientProvider client={queryClient}>
                        <RouterProvider router={Router} />
                    </QueryClientProvider>
                </DownloadClientProvider>
            </DialogManagerProvider>
        </React.StrictMode>
    );
} else {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
        <React.StrictMode>
            <TitleBar />
            <p>
                A fatal error has occurred when attempted to initalize the launcher.
                Please report this to our Discord or GitHub immediately.
            </p>
            <p>
                {error}
            </p>
        </React.StrictMode>
    );
}