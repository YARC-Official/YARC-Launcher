import { create } from "zustand";

export interface ImportantDirs {
    yarcFolder: string,
    launcherFolder: string,
    tempFolder: string,
}

export interface CustomDirs {
    yargFolder: string,
    setlistFolder: string,
}

interface ProfileStore {
    importantDirs?: ImportantDirs,
    customDirs?: CustomDirs,

    setDirs: (important: ImportantDirs, custom?: CustomDirs) => void,
}

export const useProfileStore = create<ProfileStore>()((set) => ({
    setDirs: (important, custom) => {
        return set({
            importantDirs: important,
            customDirs: custom
        });
    }
}));
