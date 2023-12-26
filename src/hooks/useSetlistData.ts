import { useSetlistState } from "@app/stores/SetlistStateStore";
import { SetlistData } from "./useSetlistRelease";
import { SetlistDownload } from "@app/tasks/Processors/Setlist";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { DialogManager } from "@app/dialogs";
import { showErrorDialog, showInstallFolderDialog } from "@app/dialogs/dialogUtil";
import { addTask, useTask } from "@app/tasks";
import { usePayload } from "@app/tasks/payload";

export enum SetlistStates {
    "AVAILABLE",
    "DOWNLOADING",
    "ERROR",
    "NEW_UPDATE"
}

export const useSetlistData = (setlistData: SetlistData) => {
    const { state, setState } = useSetlistState(setlistData?.version);
    const task = useTask("setlist", setlistData?.id);
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
    }, []);

    const download = async (dialogManager: DialogManager) => {
        if (!setlistData || state === SetlistStates.DOWNLOADING) return;

        // Ask for a download location (if required)
        if (!await showInstallFolderDialog(dialogManager)) {
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

            showErrorDialog(dialogManager, e as string);
            console.error(e);
        }
    };

    return { state, payload, download };
};