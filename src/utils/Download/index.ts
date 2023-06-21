import { useStore } from "zustand";
import { IBaseDownload } from "./Processors/base";
import { listen } from "@tauri-apps/api/event";
import { DownloadPayloadHandler } from "./payload";
import { DownloadQueueHandler } from "./queue";

export type DownloadState = "downloading"|"installing"|"waiting";

export interface DownloadPayload {
    state: DownloadState;
    current: number;
    total: number;
}

export class DownloadClient {
    
    private payloadHandler: DownloadPayloadHandler;
    private queueHandler: DownloadQueueHandler;

    constructor() {
        this.payloadHandler = new DownloadPayloadHandler();
        this.queueHandler = new DownloadQueueHandler();

        listen("progress_info", ({payload}: {payload: DownloadPayload}) => {
            this.update(payload);
        });
    }

    add(downloader: IBaseDownload) {
        this.queueHandler.add(downloader);
        this.payloadHandler.add(downloader);

        if(!this.queueHandler.current) {
            this.processNext();
        }
    }

    private async processNext() {
        const next = this.queueHandler.next();
        if(!next) return;
        
        try {
            await next.start();

            this.payloadHandler.remove(next);
            next.onFinish?.();
        } catch (e) {
            console.error(e);
        }
        
        this.processNext();
    }

    update(payload: DownloadPayload) {
        if(!this.queueHandler.current) return;
        this.payloadHandler.update(this.queueHandler.current, payload);
    }

    usePayload(uuid?: string) {
        return useStore(this.payloadHandler.payloadStore, (state) => uuid ? state[uuid] : undefined);
    }
}