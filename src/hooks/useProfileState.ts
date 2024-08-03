import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { getPathForProfile, useProfileStore } from "@app/profiles/store";
import { Profile } from "@app/profiles/types";
import { addTask, useTask } from "@app/tasks";
import { DownloadAndInstallTask } from "@app/tasks/Processors/DownloadAndInstallTask";
import { UninstallTask } from "@app/tasks/Processors/UninstallTask";
import { IBaseTask } from "@app/tasks/Processors/base";
import { getOS } from "@app/utils/os";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export enum ProfileFolderState {
    Error = 0,
    UpToDate = 1,
    UpdateRequired = 2,
    FirstDownload = 3
}

export interface ProfileState {
    loading: boolean;

    profile: Profile;
    profilePath: string;

    folderState: ProfileFolderState;
    currentTask?: IBaseTask;

    downloadAndInstall: () => Promise<void>;
    uninstall: () => Promise<void>;
    launch: () => Promise<void>;
    openInstallFolder: () => Promise<void>;
}

export const useProfileState = (profileUUID: string): ProfileState => {
    const profiles = useProfileStore();

    const [loading, setLoading] = useState<boolean>(true);
    const [profilePath, setProfilePath] = useState<string>("");

    const [folderState, setFolderState] = useState<ProfileFolderState>(0);
    const currentTask = useTask(profileUUID);

    const profile = profiles.getProfileByUUID(profileUUID);
    if (profile === undefined || profiles.importantDirs === undefined) {
        // TODO: Better error handeling here
        throw new Error("Undefined profile");
    }

    // Initialize
    useEffect(() => {
        // Set everything to default values
        // TODO: this is hacky
        setLoading(true);
        setProfilePath("");
        setFolderState(0);

        (async () => {
            const path = await getPathForProfile(profiles, profile);
            const result = await invoke("profile_folder_state", {
                path: path,
                profileVersion: profile.version
            }) as ProfileFolderState;

            setFolderState(result);
            setProfilePath(path);
            setLoading(false);
        })();
    }, [profileUUID]);

    return {
        loading,

        profile,
        profilePath,

        folderState,
        currentTask,

        downloadAndInstall: async () => {
            if (loading || profiles.importantDirs === undefined) {
                return;
            }

            const task = new DownloadAndInstallTask(profile, profilePath, profiles.importantDirs.tempFolder, () => {
                setFolderState(ProfileFolderState.UpToDate);
            });

            addTask(task);
        },
        uninstall: async () => {
            if (loading || profiles.importantDirs === undefined) {
                return;
            }

            const task = new UninstallTask(profile, profilePath, () => {
                setFolderState(ProfileFolderState.FirstDownload);
            });

            addTask(task);
        },
        launch: async () => {
            if (profile.type !== "application") {
                return;
            }

            const os = await getOS();
            const launchOptions = profile.launchOptions[os];
            if (launchOptions === undefined) {
                showErrorDialog(`Launch options not configured on profile for "${os}"!`);
                return;
            }

            try {
                await invoke("launch_profile", {
                    profilePath: profilePath,
                    execPath: launchOptions.executablePath,
                    arguments: launchOptions.arguments
                });
            } catch (e) {
                showErrorDialog(e as string);
            }
        },
        openInstallFolder: async() => {
            if (profile.type !== "application") {
                return;
            }

            try {
                await invoke("open_folder_profile", {
                    profilePath: profilePath
                });
            } catch (e) {
                showErrorDialog(e as string);
            }
        }
    };
};
