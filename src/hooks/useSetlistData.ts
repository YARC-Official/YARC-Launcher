import { useSetlistState } from "@app/stores/SetlistStateStore";
import { SetlistData } from "./useSetlistRelease";
import { useTaskClient } from "@app/tasks/provider";
import { SetlistDownload, generateSetlistUUID } from "@app/tasks/Processors/Setlist";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { DialogManager } from "@app/dialogs";
import { showErrorDialog, showInstallFolderDialog } from "@app/dialogs/dialogUtil";

export enum SetlistStates {
    "AVAILABLE",
    "DOWNLOADING",
    "ERROR",
    "NEW_UPDATE"
}

export const useSetlistData = (setlistData: SetlistData) => {
    const { state, setState } = useSetlistState(setlistData?.version);

    const taskClient = useTaskClient();
    const payload = taskClient.usePayload(generateSetlistUUID(setlistData?.id, setlistData?.version));

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

            taskClient.add(downloader);
        } catch (e) {
            setState(SetlistStates.ERROR);

            showErrorDialog(dialogManager, e as string);
            console.error(e);
        }
    };

    return { state, payload, download };
};