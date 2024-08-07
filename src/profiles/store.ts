import { invoke, path } from "@tauri-apps/api";
import { create } from "zustand";
import { Profile } from "./types";

export interface ImportantDirs {
    yarcFolder: string,
    launcherFolder: string,
    tempFolder: string,
}

export interface CustomDirs {
    yargFolder: string,
    setlistFolder: string,
}

export interface ProfileStore {
    importantDirs?: ImportantDirs,
    customDirs?: CustomDirs,

    profiles: Profile[],

        getProfileByUUID: (uuid: string) => Profile | undefined,
    setDirs: (downloadLocation?: string) => Promise<ProfileStore>,
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

                        iconUrl: "/src/assets/StableYARGIcon.png",
                        bannerBackUrl: "/src/assets/Banner/Stable.png"
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
        },
        {
            type: "setlist",
            uuid: "f5d7d7e1-a2ae-4b0e-aa40-d5daf8ef6903",
            version: "official-2024-06-12-0",

            metadata: {
                locales: {
                    "en-US": {
                        name: "YARG Official Setlist",

                        description: "This is the official setlist for YARG",

                        iconUrl: "",
                        bannerBackUrl: ""
                    }
                },
                releaseDate: new Date(),
                websiteUrl: "https://yarg.in/",

                organizer: "Hububble",
                credits: []
            },

            content: [
                {
                    name: "YARG Official Setlist Songs",
                    platforms: ["windows", "macos", "linux"],
                    files: [
                        {
                            url: "https://github.com/YARC-Official/Official-Setlist-Public/releases/download/official-2024-06-12-0/official_0.7z",
                            fileType: "encrypted"
                        }
                    ]
                }
            ]
        }
    ],
    getProfileByUUID: (uuid) => {
        return get().profiles.find(i => i.uuid === uuid);
    },
    setDirs: async (downloadLocation) => {
        const importantDirs: ImportantDirs = await invoke("get_important_dirs");

        if (downloadLocation === undefined) {
            set({
                importantDirs: importantDirs
            });
            return get();
        } else {
            // If the download location is empty for whatever reason, just set it to the default one
            if (downloadLocation === "") {
                downloadLocation = importantDirs.yarcFolder;
            }

            const customDirs: CustomDirs = await invoke("get_custom_dirs", {
                downloadLocation: downloadLocation
            });

            set({
                importantDirs: importantDirs,
                customDirs: customDirs
            });
            return get(); // This function returns the profile store itself because this does not immediately update it for the rest of the scope.
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
