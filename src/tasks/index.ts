import { useStore } from "zustand";
import { IBaseTask } from "./Processors/base";
import { listen } from "@tauri-apps/api/event";
import { TaskPayloadHandler as TaskPayloadHandler } from "./payload";
import { TaskQueueHandler as TaskQueueHandler } from "./queue";
import { throttle } from "lodash";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { DialogManager } from "@app/dialogs";

export type TaskState = "downloading" | "installing" | "verifying" | "waiting";

export interface TaskPayload {
    state: TaskState;
    current: number;
    total: number;
}

export class TaskClient {
    private payloadHandler: TaskPayloadHandler;
    private queueHandler: TaskQueueHandler;

    private dialogManager: DialogManager;

    constructor(dialogManager: DialogManager) {
        this.dialogManager = dialogManager;

        this.payloadHandler = new TaskPayloadHandler();
        this.queueHandler = new TaskQueueHandler();

        const throttleTime = 25;

        listen("progress_info",
            throttle(
                ({ payload }: { payload: TaskPayload }) => {
                    this.update(payload);
                }, throttleTime
            )
        );
    }

    add(task: IBaseTask) {
        this.queueHandler.add(task);
        this.payloadHandler.add(task);

        if (!this.queueHandler.currentStore.getState()) {
            this.processNext();
        }
    }

    private async processNext() {
        const next = this.queueHandler.next();
        if (!next) return;

        try {
            await next.start();
            next.onFinish?.();
        } catch (e) {
            showErrorDialog(this.dialogManager, e as string);
            console.error(e);
        } finally {
            this.payloadHandler.remove(next);
        }

        this.processNext();
    }

    update(payload: TaskPayload) {
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