import { createStore } from "zustand/vanilla";
import { IBaseTask } from "./Processors/base";

type TaskQueueStore = {
    queue: Set<IBaseTask>
};

export class TaskQueueHandler {
    queueStore = createStore<TaskQueueStore>(() => ({ queue: new Set() }));
    currentStore = createStore<IBaseTask | undefined>(() => undefined);

    add(task: IBaseTask) {
        this.queueStore.setState((prev) => ({ queue: new Set(prev.queue).add(task) }), true);
    }

    delete(task?: IBaseTask) {
        if (!task) return;

        this.queueStore.setState((prev) => {
            const newQueue = new Set(prev.queue);
            newQueue.delete(task);

            return { queue: newQueue };
        }, true);
    }

    next() {
        const next: IBaseTask | undefined = this.queueStore.getState().queue.values().next().value || undefined;

        this.currentStore.setState(() => next, true);
        this.delete(next);

        return next;
    }
}