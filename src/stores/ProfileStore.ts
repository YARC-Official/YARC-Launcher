import { invoke, path } from "@tauri-apps/api";
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

            content: [
                {
                    name: "YARG - Windows",
                    platforms: ["windows"],
                    files: [
                        {
                            url: "https://github.com/YARC-Official/YARG/releases/download/v0.12.4/YARG_v0.12.4-Windows-x64.zip",
                            fileType: "zip"
                        }
                    ]
                }
            ],
            launchOptions: {
                "windows": {
                    executablePath: "./YARG.exe",
                    arguments: []
                }
            }
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

export const getPathForProfile = async (store: ProfileStore, profile: Profile) => {
    if (store.customDirs === undefined) {
        throw Error("Custom directories are not initialized!");
    }

    if (profile.type === "setlist") {
        return await path.join(store.customDirs.setlistFolder, profile.uuid);
    } else {
        return await path.join(store.customDirs.yargFolder, profile.uuid);
    }
};
