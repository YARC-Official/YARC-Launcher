import { createAndShowDialog } from "@app/dialogs";
import { UninstallBeforeDeleteDialog } from "@app/dialogs/Dialogs/UninstallBeforeRemoveDialog";
import { downloadAndInstall, launch, openInstallFolder, uninstall } from "@app/profiles/actions";
import { useDirectories } from "@app/profiles/directories";
import { useProfileStore } from "@app/profiles/store";
import { ActiveProfile, Version } from "@app/profiles/types";
import { getPathForProfile, getProfileVersion } from "@app/profiles/utils";
import { useTask } from "@app/tasks";
import { IBaseTask } from "@app/tasks/Processors/base";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    version: Version,

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
    const [version, setVersion] = useState<Version>({} as Version);

    const activeProfile = profiles.getProfileByUUID(profileUUID);
    if (activeProfile === undefined) {
        throw new Error("Undefined profile");
    }

    // Initialize
    useEffect(() => {
        // Set everything to default values
        // TODO: this is hacky
        setLoading(true);
        setProfilePath("");
        setFolderState(0);
        setVersion({} as Version);

        // If the important directories aren't loaded yet, wait for them to
        if (directories.importantDirs === undefined) {
            return;
        }

        (async () => {
            const path = await getPathForProfile(directories, activeProfile);
            const version = getProfileVersion(activeProfile);

            const result = await invoke("profile_folder_state", {
                path: path,
                wantedTag: version.tag
            }) as ProfileFolderState;

            setFolderState(result);
            setProfilePath(path);
            setLoading(false);
            setVersion(version);
        })();
    }, [directories, profileUUID]);

    return {
        loading,

        activeProfile,
        profilePath,

        folderState,
        currentTask,
        version,

        downloadAndInstall: async () => {
            if (loading) {
                return;
            }

            await downloadAndInstall(activeProfile, profilePath, () => {
                setFolderState(ProfileFolderState.UpToDate);
            });
        },
        uninstall: async () => {
            if (loading) {
                return;
            }

            await uninstall(activeProfile, profilePath, () => {
                setFolderState(ProfileFolderState.FirstDownload);
            });
        },
        launch: async () => {
            if (loading) {
                return;
            }

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

            if (folderState !== ProfileFolderState.FirstDownload && folderState !== ProfileFolderState.UpdateRequired) {
                createAndShowDialog(UninstallBeforeDeleteDialog);
                return;
            }

            navigate("/");
            await profiles.removeProfile(activeProfile.uuid);
        }
    };
};
