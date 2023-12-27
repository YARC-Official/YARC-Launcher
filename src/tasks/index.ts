import { useStore } from "zustand";
import { IBaseTask, TaskTag } from "./Processors/base";
import QueueStore from "./queue";

const addTask = (task: IBaseTask) => {
    QueueStore.add(task);

    if(QueueStore.firstTask() === task) {
        processNextTask();
    }
};

const processNextTask = async () => {
    const next = QueueStore.next();
    if(!next) return;

    try {
        next.startedAt = new Date();
        await next.start();
        next.onFinish?.();
    } catch (e) {
        // TO-DO: reimplement dialog error message;
        console.error(e);
    }

    processNextTask();
};

const useTask = (tag: TaskTag, profile: string) => {
    return useStore(
        QueueStore.store,
        queue => QueueStore.findTask(queue, tag, profile)
    );
};

const useCurrentTask = () => {
    return useStore(
        QueueStore.store,
        () => QueueStore.firstTask()
    );
};

export { addTask, processNextTask, useTask, useCurrentTask };