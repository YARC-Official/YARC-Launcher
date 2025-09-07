import { createAndShowDialog } from "@app/dialogs";
import { UninstallBeforeDeleteDialog } from "@app/dialogs/Dialogs/UninstallBeforeRemoveDialog";
import { downloadAndInstall, launch, openInstallFolder, uninstall } from "@app/profiles/actions";
import { useDirectories } from "@app/profiles/directories";
import { useProfileStore } from "@app/profiles/store";
import { ActiveProfile } from "@app/profiles/types";
import { getPathForProfile } from "@app/profiles/utils";
import { useTask } from "@app/tasks";
import { IBaseTask } from "@app/tasks/Processors/base";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QueueStore from "../tasks/queue";

export enum ProfileFolderState {
    Error = 0,
    UpToDate = 1,
    UpdateRequired = 2,
    FirstDownload = 3
}

export interface ProfileState {
    loading: boolean,

    activeProfile: ActiveProfile,
    profilePath: string,

    folderState: ProfileFolderState,
    currentTask?: IBaseTask,

    downloadAndInstall: () => Promise<void>,
    uninstall: () => Promise<void>,
    launch: () => Promise<void>,
    openInstallFolder: () => Promise<void>,
    deleteProfile: () => Promise<void>,
}

export const useProfileState = (profileUUID: string): ProfileState => {
    const directories = useDirectories();
    const profiles = useProfileStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [profilePath, setProfilePath] = useState<string>("");

    const [folderState, setFolderState] = useState<ProfileFolderState>(0);
    const currentTask = useTask(profileUUID);

    const activeProfile = profiles.getProfileByUUID(profileUUID);
    if (activeProfile === undefined) {
        throw new Error("Undefined profile");
    }

    // Initialize
    useEffect(() => {
        // Set everything to default values
        // This is hacky, but there's not much else we can do lol
        setLoading(true);
        setProfilePath("");
        setFolderState(0);

        // If the important directories aren't loaded yet, wait for them to
        if (directories.importantDirs === undefined) {
            return;
        }

        (async () => {
            const path = await getPathForProfile(directories, activeProfile);

            const result = await invoke("profile_folder_state", {
                path: path,
                wantedTag: activeProfile.version.tag
            }) as ProfileFolderState;

            setFolderState(result);
            setProfilePath(path);
            setLoading(false);
        })();
    }, [directories, profileUUID, activeProfile.version, currentTask]);

    return {
        loading,

        activeProfile,
        profilePath,

        folderState,
        currentTask,

        downloadAndInstall: async () => {
            if (loading) {
                return;
            }

            await downloadAndInstall(activeProfile, profilePath);
        },
        uninstall: async () => {
            if (loading) {
                return;
            }

            await uninstall(activeProfile, profilePath);
        },
        launch: async () => {
            if (loading || activeProfile.profile.type === "setlist" || activeProfile.profile.type === "venue") {
                return;
            }

            activeProfile.lastPlayed = new Date().toISOString();
            await profiles.updateProfile(activeProfile);

            await launch(activeProfile, profilePath);
        },
        openInstallFolder: async () => {
            if (loading) {
                return;
            }

            await openInstallFolder(activeProfile, profilePath);
        },
        deleteProfile: async () => {
            if (loading) {
                return;
            }

            if (folderState !== ProfileFolderState.FirstDownload ||
                QueueStore.findTask(QueueStore.store.getState(), activeProfile.uuid)) {
                createAndShowDialog(UninstallBeforeDeleteDialog);
                return;
            }

            navigate("/");
            await profiles.removeProfile(activeProfile.uuid);
        }
    };
};
