import { useEffect } from "react";
import { ReleaseData, getYARGReleaseZip } from "./useReleases";
import { invoke } from "@tauri-apps/api/tauri";
import { useYARGState } from "@app/stores/YARGStateStore";
import { useDownloadPayload } from "@app/stores/DownloadStore";

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
    const { remove: removePayloadState } = useDownloadPayload(releaseData.tag_name);

    useEffect(() => {
        (
            async () => {
                if(!releaseData) return;

                const exists = await invoke("version_exists_yarg", {
                    versionId: releaseData.tag_name
                });

                setState(exists ? YARGStates.AVAILABLE : YARGStates.NEW_UPDATE);
            }
        )();
    }, [releaseData]);

    const play = async () => {
        if(!releaseData) return;

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
        if(!releaseData) return;

        setState(YARGStates.DOWNLOADING);

        try {
            const zipUrl = await getYARGReleaseZip(releaseData);

            await invoke("download_yarg", {
                zipUrl,
                versionId: releaseData.tag_name
            });

            setState(YARGStates.AVAILABLE);
            removePayloadState();
        } catch (e) {
            setState(YARGStates.ERROR);
        }
    };

    return { state, play, download };
};

