import { create } from "zustand";

interface OfflineStore {
    isOffline: boolean;

    setOffline: (isOffline: boolean) => void;
}

export const useOfflineStatus = create<OfflineStore>()((set) => ({
    isOffline: false,
    setOffline: (isOffline) => {
        set({
            isOffline: isOffline
        });
    }
}));
