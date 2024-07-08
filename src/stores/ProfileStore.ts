import { invoke } from "@tauri-apps/api";
import { create } from "zustand";
import { Profile } from "./ProfileTypes";

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

    profiles: Profile[],

    getProfileByUUID: (uuid: string) => Profile | undefined,
    setDirs: (downloadLocation?: string) => Promise<void>,
}

export const useProfileStore = create<ProfileStore>()((set, get) => ({
    profiles: [
        {
            type: "application",
            uuid: "2d78800c-1397-496a-83c1-50759607999a",
            version: "v0.12.4",

            metadata: {
                locales: {
                    "en-US": {
                        name: "YARG",
                        releaseName: "Stable",

                        description: "This is the stable verison of YARG",

                        iconUrl: "",
                        bannerBackUrl: ""
                    }
                },
                releaseDate: new Date(),
                websiteUrl: "https://yarg.in/"
            },

            content: [],
            launchOptions: {}
        }
    ],
    getProfileByUUID: (uuid) => {
        return get().profiles.find(i => i.uuid === uuid);
    },
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
