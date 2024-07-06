import { invoke } from "@tauri-apps/api";
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

    setDirs: (downloadLocation?: string) => Promise<void>,
}

export const useProfileStore = create<ProfileStore>()((set) => ({
    setDirs: async (downloadLocation) => {
        const importantDirs: ImportantDirs = await invoke("get_important_dirs");

        if (downloadLocation === undefined) {
            return set({
                importantDirs: importantDirs
            });
        } else {
            // If the download location is empty for whatever reason, just set it to the default one
            if (downloadLocation === "") {
                downloadLocation = importantDirs.yarcFolder;
            }

            const customDirs: CustomDirs = await invoke("get_custom_dirs", {
                downloadLocation: downloadLocation
            });

            return set({
                importantDirs: importantDirs,
                customDirs: customDirs
            });
        }
    }
}));
