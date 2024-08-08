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
            metadata: {
                name: "YARG",
                description: "This is the stable version of YARG",
                releaseName: "Stable",

                iconUrl: "/src/assets/Profiles/Icons/Stable.png",
                bannerBackUrl: "/src/assets/Profiles/Banners/Stable.png",

                initialRelease: new Date(),

                links: {
                    "website": {
                        name: "Official Website",
                        url: "https://yarg.in"
                    }
                },

                localeOverrides: {},
            },
            version: {
                type: "embedded",

                version: {
                    uuid: "c8d67887-019e-4662-ba1e-0f6ba1839a42",
                    tag: "v0.12.4",
                    release: new Date(),
                    content: [
                        {
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
            },
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

            return get();
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
