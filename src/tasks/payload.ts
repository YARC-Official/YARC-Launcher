import { createStore } from "zustand/vanilla";
import { TaskPayload } from ".";
import { IBaseTask } from "./Processors/base";

interface TaskPayloadStore {
    [key: string]: TaskPayload,
}

export class TaskPayloadHandler {
    payloadStore = createStore<TaskPayloadStore>(() => ({}));

    add(task: IBaseTask) {
        const initialPayload: TaskPayload = {
            state: "waiting",
            current: 0,
            total: 0,
        };

        this.update(task, initialPayload);
    }

    update(task: IBaseTask, payload: TaskPayload) {
        const uuid = task.taskUUID;
        return this.payloadStore.setState({ [uuid]: { ...payload } });
    }

    remove(task: IBaseTask) {
        const uuid = task.taskUUID;
        return this.payloadStore.setState({ [uuid]: undefined });
    }
}

export const calculatePayloadPercentage = (payload?: TaskPayload): number | undefined => {
    if (!payload) return undefined;

    return payload.total > 0 ? (payload.current / payload.total) * 100 : undefined;
};