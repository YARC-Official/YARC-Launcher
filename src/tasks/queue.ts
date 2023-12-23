import { createStore } from "zustand/vanilla";
import { IBaseDownload } from "./Processors/base";

type DownloadQueueStore = {
    queue: Set<IBaseDownload>
};

export class DownloadQueueHandler {
    queueStore = createStore<DownloadQueueStore>(() => ({ queue: new Set() }));
    currentStore = createStore<IBaseDownload | undefined>(() => undefined);

    add(downloader: IBaseDownload) {
        this.queueStore.setState((prev) => ({ queue: new Set(prev.queue).add(downloader) }), true);
    }

    delete(downloader?: IBaseDownload) {
        if (!downloader) return;

        this.queueStore.setState((prev) => {
            const newQueue = new Set(prev.queue);
            newQueue.delete(downloader);

            return { queue: newQueue };
        }, true);
    }

    next() {
        const next: IBaseDownload | undefined = this.queueStore.getState().queue.values().next().value || undefined;

        this.currentStore.setState(() => next, true);
        this.delete(next);

        return next;
    }
}