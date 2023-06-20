import { useStore } from "zustand";
import { IBaseDownload } from "./Processors/base";
import { listen } from "@tauri-apps/api/event";
import { DownloadPayloadHandler } from "./payload";

export type DownloadState = "downloading"|"installing"|"waiting";

export interface DownloadPayload {
    state: DownloadState;
    current: number;
    total: number;
}

export class DownloadClient {
    
    private payloadHandler: DownloadPayloadHandler;

    private queue: Set<IBaseDownload> = new Set();
    private current?: IBaseDownload;

    constructor() {
        this.payloadHandler = new DownloadPayloadHandler();

        listen("progress_info", ({payload}: {payload: DownloadPayload}) => {
            this.update(payload);
        });
    }

    add(downloader: IBaseDownload) {
        this.queue.add(downloader);
        this.payloadHandler.add(downloader);

        if(!this.current) {
            this.processNext();
        }
    }

    private async processNext() {
        this.current = undefined;

        const next: IBaseDownload = this.queue.values().next().value;
        if(!next) return;
        
        this.current = next;
        this.queue.delete(next);
        
        try {
            await next.start();

            this.payloadHandler.remove(this.current);
            next.onFinish?.();
        } catch (e) {
            console.error(e);
        }
        
        this.processNext();
    }

    update(payload: DownloadPayload) {
        if(!this.current) return;
        this.payloadHandler.update(this.current, payload);
    }

    usePayload(uuid?: string) {
        return useStore(this.payloadHandler.payloadStore, (state) => uuid ? state[uuid] : undefined);
    }
}