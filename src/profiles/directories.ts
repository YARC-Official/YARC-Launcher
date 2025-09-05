import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

export interface ImportantDirs {
    yarcFolder: string,
    launcherFolder: string,
    tempFolder: string,
}

export interface CustomDirs {
    installFolder: string,
    yargFolder: string,
    setlistFolder: string,
    venueFolder: string,
}

export interface DirectoriesStore {
    importantDirs?: ImportantDirs,
    customDirs?: CustomDirs,

    setDirs: (downloadLocation?: string) => Promise<void>;
}

export const useDirectories = create<DirectoriesStore>()((set) => ({
    setDirs: async (downloadLocation?: string) => {
        const importantDirs: ImportantDirs = await invoke("get_important_dirs");

        if (downloadLocation === undefined) {
            set({
                importantDirs
            });
        } else {
            // If the download location is empty for whatever reason, just set it to the default one
            if (downloadLocation === "") {
                downloadLocation = importantDirs.yarcFolder;
            }

            const customDirs: CustomDirs = await invoke("get_custom_dirs", {
                downloadLocation: downloadLocation
            });

            set({
                importantDirs,
                customDirs
            });
        }
    }
}));
