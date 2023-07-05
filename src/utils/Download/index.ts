import { useStore } from "zustand";
import { IBaseDownload } from "./Processors/base";
import { listen } from "@tauri-apps/api/event";
import { DownloadPayloadHandler } from "./payload";
import { DownloadQueueHandler } from "./queue";
import { throttle } from "lodash";

export type DownloadState = "downloading" | "installing" | "verifying" | "waiting";

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

        const throttleTime = 25;

        listen("progress_info",
            throttle(
                ({ payload }: { payload: DownloadPayload }) => {
                    this.update(payload);
                }, throttleTime
            )
        );
    }

    add(downloader: IBaseDownload) {
        this.queueHandler.add(downloader);
        this.payloadHandler.add(downloader);

        if (!this.queueHandler.currentStore.getState()) {
            this.processNext();
        }
    }

    private async processNext() {
        const next = this.queueHandler.next();
        if (!next) return;

        try {
            await next.start();

            this.payloadHandler.remove(next);
            next.onFinish?.();
        } catch (e) {
            // TODO: This should show a process, and cancel the payload
            console.error(e);
        }

        this.processNext();
    }

    update(payload: DownloadPayload) {
        const current = this.queueHandler.currentStore.getState();

        if (!current) return;
        this.payloadHandler.update(current, payload);
    }

    usePayload(uuid?: string) {
        return useStore(
            this.payloadHandler.payloadStore,
            (state) => uuid ? state[uuid] : undefined
        );
    }

    useQueue() {
        return useStore(
            this.queueHandler.queueStore,
            (store) => store.queue,
            (oldStore, newStore) => oldStore.size === newStore.size
        );
    }

    useCurrent() {
        return useStore(this.queueHandler.currentStore);
    }
}