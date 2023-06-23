import { useSetlistState } from "@app/stores/SetlistStateStore";
import { SetlistData } from "./useSetlistRelease";
import { useDownloadClient } from "@app/utils/Download/provider";
import { SetlistDownload, generateSetlistUUID } from "@app/utils/Download/Processors/Setlist";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export enum SetlistStates {
    "AVAILABLE",
    "DOWNLOADING",
    "ERROR",
    "NEW_UPDATE"
}

export const useSetlistData = (setlistData: SetlistData) => {
    const { state, setState } = useSetlistState(setlistData?.version);

    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateSetlistUUID(setlistData?.id, setlistData?.version));

    useEffect(() => {
        (
            async () => {
                if(!setlistData) return;
                
                const exists = await invoke("version_exists_setlist", {
                    id: setlistData.id,
                    version: setlistData.version
                });

                setState(exists ? SetlistStates.AVAILABLE : SetlistStates.NEW_UPDATE);
            }
        )();
    }, []);
    
    const download = async () => {
        if(!setlistData || state === SetlistStates.DOWNLOADING) return;

        setState(SetlistStates.DOWNLOADING);

        try {
            const downloader = new SetlistDownload(
                setlistData.downloads,
                setlistData.id,
                setlistData.version,
                () => { setState(SetlistStates.AVAILABLE); }
            );

            downloadClient.add(downloader);
        } catch (e) {
            setState(SetlistStates.ERROR);
            console.error(e);
        }
    };

    return { state, payload, download };
};