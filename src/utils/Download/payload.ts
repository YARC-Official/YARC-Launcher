import { createStore } from "zustand/vanilla";
import { DownloadPayload } from ".";
import { IBaseDownload } from "./Processors/base";

interface DownloadPayloadStore {
    [key: string]: DownloadPayload,
}

export class DownloadPayloadHandler {
    payloadStore = createStore<DownloadPayloadStore>(() => ({}));

    add(downloader: IBaseDownload) {
        const initialPayload: DownloadPayload = {
            state: "waiting",
            current: 0,
            total: 0,
        };

        this.update(downloader, initialPayload);
    }

    update(downloader: IBaseDownload, payload: DownloadPayload) {
        const uuid = downloader.uuid;
        return this.payloadStore.setState({[uuid]: {...payload}});
    }

    remove(downloader: IBaseDownload) {
        const uuid = downloader.uuid;
        return this.payloadStore.setState({[uuid]: undefined});
    }
}

export const calculatePayloadPercentage = (payload?: DownloadPayload): number | undefined => {
    if(!payload) return undefined;

    return payload.total > 0 ? (payload.current / payload.total) * 100 : undefined;
};