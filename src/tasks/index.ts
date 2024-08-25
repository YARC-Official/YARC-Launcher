import { useStore } from "zustand";
import { IBaseTask } from "./Processors/base";
import QueueStore from "./queue";
import { showErrorDialog } from "@app/dialogs";

const addTask = (task: IBaseTask) => {
    QueueStore.add(task);

    if (QueueStore.firstTask() === task) {
        processNextTask();
    }
};

const processNextTask = async () => {
    const next = QueueStore.next();
    if (!next) {
        return;
    }

    try {
        next.startedAt = new Date();
        await next.start();
        next.onFinish?.();
    } catch (e) {
        showErrorDialog(e as string);
        console.error(e);
    }

    processNextTask();
};

const useTask = (profileUUID: string) => {
    return useStore(
        QueueStore.store,
        queue => QueueStore.findTask(queue, profileUUID)
    );
};

const useCurrentTask = () => {
    return useStore(
        QueueStore.store,
        () => QueueStore.firstTask()
    );
};

export { addTask, processNextTask, useTask, useCurrentTask };
