import { createStore } from "zustand/vanilla";
import { IBaseTask } from "./Processors/base";
import QueueStore from "./queue";
import { listen } from "@tauri-apps/api/event";
import { throttle } from "lodash";
import { useStore } from "zustand";

export type TaskState = "downloading" | "installing" | "verifying" | "waiting";

export interface TaskPayload {
    state: TaskState;
    current: number;
    total: number;
}

interface TaskPayloadStore {
    [key: string]: TaskPayload,
}

const store = createStore<TaskPayloadStore>(() => ({}));

const createPayload = (task: IBaseTask) => {
    const initialPayload: TaskPayload = {
        state: "waiting",
        current: 0,
        total: 0,
    };

    setPayload(task, initialPayload);
};

const setPayload = (task: IBaseTask, payload: TaskPayload) => {
    const uuid = task.taskUUID;
    return store.setState({ [uuid]: { ...payload } });
};

const removePayload = (task: IBaseTask) => {
    const uuid = task.taskUUID;
    return store.setState({ [uuid]: undefined });
};

const usePayload = (uuid?: string) => {
    return useStore(
        store,
        store => uuid ? store[uuid] : undefined
    );
};

const calculatePayloadPercentage = (payload?: TaskPayload): number | undefined => {
    if (!payload) return undefined;

    return payload.total > 0 ? (payload.current / payload.total) * 100 : undefined;
};

export { store, createPayload, updatePayload, removePayload, usePayload, calculatePayloadPercentage };

const throttleTime = 25;

listen("progress_info",
    throttle(
        ({ payload }: { payload: TaskPayload }) => {
            updatePayload(payload);
        }, throttleTime
    )
);

const updatePayload = (payload: TaskPayload) => {
    const current = QueueStore.firstTask();
    if(!current) return console.warn("Received a payload but no current task is loaded.");

    return setPayload(current, payload);
};