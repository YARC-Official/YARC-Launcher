import { createStore } from "zustand/vanilla";
import { IBaseTask } from "./Processors/base";
import { useStore } from "zustand";

type TaskQueueStore = Set<IBaseTask>;

const store = createStore<TaskQueueStore>(() => new Set<IBaseTask>());

const firstTask = (): IBaseTask | undefined => {
    const queue = store.getState();
    return queue.values().next().value;
};

const add = (task: IBaseTask) => {
    store.setState(previousQueue => new Set(previousQueue).add(task), true);
};

const remove = (task: IBaseTask) => {
    store.setState(previousQueue => {
        const queue = new Set(previousQueue);
        queue.delete(task);

        return queue;
    }, true);
};

const next = () => {
    const current = firstTask();
    if (current?.startedAt) {
        remove(current);
    }

    return firstTask();
};

const findTask = (queue: TaskQueueStore, profileUUID: string) => {
    for (const task of queue) {
        if (task.profile.uuid === profileUUID) {
            return task;
        }
    }

    return undefined;
};

const useQueue = () => {
    return useStore(store);
};

export const QueueStore = { store, firstTask, add, remove, next, findTask, useQueue };
export default QueueStore;
