import { useSetlistState } from "@app/stores/SetlistStateStore";
import { SetlistData } from "./useSetlistRelease";
import { SetlistDownload, SetlistUninstall } from "@app/tasks/Processors/Setlist";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { showErrorDialog, showInstallFolderDialog } from "@app/dialogs/dialogUtil";
import { addTask, useTask } from "@app/tasks";
import { TaskPayload, usePayload } from "@app/tasks/payload";

export enum SetlistStates {
    "AVAILABLE",
    "DOWNLOADING",
    "ERROR",
    "LOADING",
    "NEW_UPDATE"
}

export type SetlistVersion = {
    state: SetlistStates,
    download: () => Promise<void>,
    uninstall: () => Promise<void>,
    payload?: TaskPayload
}

export const useSetlistData = (setlistData: SetlistData | undefined, setlistId: string): SetlistVersion => {
    const { state, setState } = useSetlistState(setlistData?.version);
    const task = useTask("setlist", setlistId);
    const payload = usePayload(task?.taskUUID);

    useEffect(() => {
        (
            async () => {
                if (state || !setlistData) return;

                const exists = await invoke("exists", {
                    appName: "official_setlist",
                    version: setlistData.version,
                    profile: setlistData.id
                });

                setState(exists ? SetlistStates.AVAILABLE : SetlistStates.NEW_UPDATE);
            }
        )();
    }, [setlistData]);

    // If we don't have a release data yet, return a dummy loading version;
    if (!setlistData) {
        return {
            state,
            download: async () => {},
            uninstall: async () => {},
        };
    }

    const download = async () => {
        if (!setlistData || state === SetlistStates.DOWNLOADING) return;

        // Ask for a download location (if required)
        if (!await showInstallFolderDialog()) {
            // Skip if the dialog is closed or it errors
            return;
        }

        setState(SetlistStates.DOWNLOADING);

        try {
            const downloader = new SetlistDownload(
                setlistData.downloads,
                setlistData.id,
                setlistData.version,
                () => { setState(SetlistStates.AVAILABLE); }
            );

            addTask(downloader);
        } catch (e) {
            setState(SetlistStates.ERROR);

            showErrorDialog(e as string);
            console.error(e);
        }
    };

    const uninstall = async () => {
        if (!setlistData || state === SetlistStates.DOWNLOADING) return;

        // You can't uninstall if the launcher is not initialized
        if (!await invoke("is_initialized")) return;

        setState(SetlistStates.DOWNLOADING);

        try {
            const downloader = new SetlistUninstall(
                setlistData.id,
                setlistData.version,
                () => { setState(SetlistStates.NEW_UPDATE); }
            );

            addTask(downloader);
        } catch (e) {
            setState(SetlistStates.ERROR);

            showErrorDialog(e as string);
            console.error(e);
        }
    };

    return { state, download, uninstall, payload };
};