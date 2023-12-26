import { useEffect } from "react";
import { ExtendedReleaseData, getYARGReleaseZip, getYARGReleaseSigFromZipURL, YARGChannels } from "./useYARGRelease";
import { invoke } from "@tauri-apps/api/tauri";
import { type } from "@tauri-apps/api/os";
import { useYARGState } from "@app/stores/YARGStateStore";
import { YARGDownload } from "@app/tasks/Processors/YARG";
import { showErrorDialog, showInstallFolderDialog } from "@app/dialogs/dialogUtil";
import { useDialogManager } from "@app/dialogs/DialogProvider";
import { addTask, useTask } from "@app/tasks";
import { usePayload, TaskPayload } from "@app/tasks/payload";

export enum YARGStates {
    "AVAILABLE",
    "DOWNLOADING",
    "ERROR",
    "PLAYING",
    "LOADING",
    "NEW_UPDATE"
}

export type YARGVersion = {
    state: YARGStates,
    play: () => Promise<void>,
    download: () => Promise<void>,
    payload?: TaskPayload
}

export const useYARGVersion = (releaseData: ExtendedReleaseData | undefined, profileName: YARGChannels): YARGVersion => {
    // Initialize hooks before returning
    const { state, setState } = useYARGState(releaseData?.tag_name);
    const dialogManager = useDialogManager();
    const task = useTask("yarg", profileName);
    const payload = usePayload(task?.taskUUID);

    useEffect(() => {
        (
            async () => {
                if (state || !releaseData) return;

                const exists = await invoke("exists", {
                    appName: "yarg",
                    version: releaseData.tag_name,
                    profile: profileName
                });

                setState(exists ? YARGStates.AVAILABLE : YARGStates.NEW_UPDATE);
            }
        )();
    }, [releaseData]);

    // If we don't have a release data yet, return a dummy loading version;
    if (!releaseData) {
        return {
            state,
            play: async () => {},
            download: async () => {},
        };
    }

    const play = async () => {
        if (!releaseData) return;

        setState(YARGStates.LOADING);

        try {
            await invoke("launch", {
                appName: "yarg",
                version: releaseData.tag_name,
                profile: profileName
            });

            setState(YARGStates.PLAYING);

            // As we don't have a way to check if the YARG game process is closed, we set a timer to avoid locking the state to PLAYING
            setTimeout(() => {
                setState(YARGStates.AVAILABLE);
            }, 10 * 1000);
        } catch (e) {
            setState(YARGStates.ERROR);

            showErrorDialog(dialogManager, e as string);
            console.error(e);
        }
    };

    const download = async () => {
        if (!releaseData || state === YARGStates.DOWNLOADING) return;

        // Ask for a download location (if required)
        if (!await showInstallFolderDialog(dialogManager)) {
            // Skip if the dialog is closed or it errors
            return;
        }

        setState(YARGStates.DOWNLOADING);

        try {
            const platformType = await type();
            const zipUrl = getYARGReleaseZip(releaseData, platformType);
            const sigUrl = getYARGReleaseSigFromZipURL(releaseData, zipUrl);

            const downloader = new YARGDownload(
                zipUrl,
                sigUrl,
                releaseData.channel,
                releaseData.tag_name,
                profileName,
                () => { setState(YARGStates.AVAILABLE); }
            );

            addTask(downloader);
        } catch (e) {
            setState(YARGStates.ERROR);

            showErrorDialog(dialogManager, e as string);
            console.error(e);
        }
    };

    return { state, play, download, payload };
};