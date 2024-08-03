import { downloadAndInstall, launch, openInstallFolder, uninstall } from "@app/profiles/actions";
import { getPathForProfile, useProfileStore } from "@app/profiles/store";
import { Profile } from "@app/profiles/types";
import { useTask } from "@app/tasks";
import { IBaseTask } from "@app/tasks/Processors/base";
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
            if (loading) {
                return;
            }

            await downloadAndInstall(profile, profiles, profilePath, () => {
                setFolderState(ProfileFolderState.UpToDate);
            });
        },
        uninstall: async () => {
            if (loading) {
                return;
            }

            await uninstall(profile, profiles, profilePath, () => {
                setFolderState(ProfileFolderState.FirstDownload);
            });
        },
        launch: async () => {
            if (loading) {
                return;
            }

            await launch(profile, profilePath);
        },
        openInstallFolder: async() => {
            if (loading) {
                return;
            }

            await openInstallFolder(profile, profilePath);
        }
    };
};
