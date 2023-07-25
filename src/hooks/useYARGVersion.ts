import { useEffect } from "react";
import { ExtendedReleaseData, getYARGReleaseZip, getYARGReleaseSig } from "./useYARGRelease";
import { invoke } from "@tauri-apps/api/tauri";
import { useYARGState } from "@app/stores/YARGStateStore";
import { useDownloadClient } from "@app/utils/Download/provider";
import { YARGDownload, generateYARGUUID } from "@app/utils/Download/Processors/YARG";
import { DownloadPayload } from "@app/utils/Download";
import { showErrorDialog, showInstallFolderDialog } from "@app/dialogs/dialogUtil";
import { useDialogManager } from "@app/dialogs/DialogProvider";

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
    payload?: DownloadPayload
}

export const useYARGVersion = (releaseData: ExtendedReleaseData, profileName: string) => {
    const { state, setState } = useYARGState(releaseData?.tag_name);

    const dialogManager = useDialogManager();
    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateYARGUUID(releaseData?.tag_name));

    useEffect(() => {
        (
            async () => {
                if (state || !releaseData) return;

                const exists = await invoke("version_exists_yarg", {
                    versionId: releaseData.tag_name,
                    profile: profileName
                });

                setState(exists ? YARGStates.AVAILABLE : YARGStates.NEW_UPDATE);
            }
        )();
    }, [releaseData]);

    const play = async () => {
        if (!releaseData) return;

        setState(YARGStates.LOADING);

        try {
            await invoke("play_yarg", {
                versionId: releaseData.tag_name,
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
            const zipUrl = await getYARGReleaseZip(releaseData);
            const sigUrl = await getYARGReleaseSig(releaseData);

            const downloader = new YARGDownload(
                zipUrl,
                sigUrl,
                releaseData.channel,
                releaseData.tag_name,
                profileName,
                () => { setState(YARGStates.AVAILABLE); }
            );

            downloadClient.add(downloader);
        } catch (e) {
            setState(YARGStates.ERROR);

            showErrorDialog(dialogManager, e as string);
            console.error(e);
        }
    };

    return { state, play, download, payload } as YARGVersion;
};