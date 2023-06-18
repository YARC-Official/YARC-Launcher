import { useEffect } from "react";
import { create } from "zustand";
import { listen } from "@tauri-apps/api/event";

interface DownloadPayload {
    downloadId: string,
    total: number,
    current: number
}

interface DownloadStore {
    downloads: {
        [downloadId: string]: DownloadPayload
    },
    update: (downloadId: string, payload: DownloadPayload) => void,
    remove: (downloadId: string) => void,
}

const useDownloadStore = create<DownloadStore>()((set) => ({
    downloads: {},

    update(downloadId, payload) {
        return set(current => ({
            downloads: {
                ...current.downloads,
                [downloadId]: payload
            }
        }));
    },

    remove(downloadId) {
        return set(current => {
            delete current.downloads[downloadId];
            return current;
        });
    },
}));

export const useDownloadPayload = (downloadId: string) => {
    const store = useDownloadStore();

    const payload = store.downloads[downloadId];
    const update = (updatedPayload: DownloadPayload) => store.update(downloadId, updatedPayload);
    const remove = () => store.remove(downloadId);

    return { payload, update, remove };
};

export const DownloadListenerClient: React.FC = () => {
    useEffect(() => {
        
        const event = listen("download_progress", ({payload}: {payload: DownloadPayload}) => {
            const { update } = useDownloadPayload(payload.downloadId);
            update(payload);
        });

        return () => {
            event.then(unlisten => unlisten());
        };

    }, []);

    return null;
};
