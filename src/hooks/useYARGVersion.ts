import { useEffect } from "react";
import { ReleaseData, getYARGReleaseZip, getYARGReleaseSig } from "./useYARGRelease";
import { invoke } from "@tauri-apps/api/tauri";
import { useYARGState } from "@app/stores/YARGStateStore";
import { useDownloadClient } from "@app/utils/Download/provider";
import { YARGDownload, generateYARGUUID } from "@app/utils/Download/Processors/YARG";

export enum YARGStates {
    "AVAILABLE",
    "DOWNLOADING",
    "ERROR",
    "PLAYING",
    "LOADING",
    "NEW_UPDATE"
}

export const useYARGVersion = (releaseData: ReleaseData) => {
    const { state, setState } = useYARGState(releaseData?.tag_name);

    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateYARGUUID(releaseData?.tag_name));

    useEffect(() => {
        (
            async () => {
                if (!releaseData) return;

                const exists = await invoke("version_exists_yarg", {
                    versionId: releaseData.tag_name
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
            });

            setState(YARGStates.PLAYING);
        } catch (e) {
            setState(YARGStates.ERROR);
            console.error(e);
        }
    };

    const download = async () => {
        if (!releaseData || state === YARGStates.DOWNLOADING) return;

        setState(YARGStates.DOWNLOADING);

        try {
            const zipUrl = await getYARGReleaseZip(releaseData);
            const sigUrl = await getYARGReleaseSig(releaseData);

            const downloader = new YARGDownload(
                zipUrl,
                sigUrl,
                releaseData.tag_name,
                () => { setState(YARGStates.AVAILABLE); }
            );

            downloadClient.add(downloader);
        } catch (e) {
            setState(YARGStates.ERROR);
        }
    };

    return { state, play, download, payload };
};

