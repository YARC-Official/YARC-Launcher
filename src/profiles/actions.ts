import { DownloadAndInstallTask } from "@app/tasks/Processors/DownloadAndInstallTask";
import { ActiveProfile } from "./types";
import { addTask } from "@app/tasks";
import { UninstallTask } from "@app/tasks/Processors/UninstallTask";
import { getOS } from "@app/utils/os";
import { invoke } from "@tauri-apps/api/core";
import { useDirectories } from "./directories";
import { createAndShowDialog, showErrorDialog } from "@app/dialogs";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";
import { settingsManager } from "@app/settings";
import { getApiLaunchArgument } from "@app/utils/graphicsApi";
import { MsvcDialog } from "@app/dialogs/Dialogs/MsvcDialog";
import {TaskPayload} from "@app/tasks/payload";
import {listen, UnlistenFn} from "@tauri-apps/api/event";

export const downloadAndInstall = async (profile: ActiveProfile, profilePath: string, onFinish?: () => void): Promise<void> => {
    const directories = useDirectories.getState();
    if (directories.importantDirs === undefined) {
        return;
    }

    const tempFolder = directories.importantDirs.tempFolder;
    const task = new DownloadAndInstallTask(profile, profilePath, tempFolder, onFinish);
    addTask(task);
};

export const uninstall = async (profile: ActiveProfile, profilePath: string, onFinish?: () => void): Promise<void> => {
    const directories = useDirectories.getState();
    if (directories.importantDirs === undefined) {
        return;
    }

    const task = new UninstallTask(profile, profilePath, onFinish);
    addTask(task);
};

export const launch = async (activeProfile: ActiveProfile, profilePath: string): Promise<void> => {
    if (activeProfile.profile.type !== "application") {
        showErrorDialog(`Cannot launch profile of type "${activeProfile.profile.type}"!`);
        return;
    }

    const os = await getOS();
    const launchOptions = activeProfile.version.launchOptions?.[os];
    if (launchOptions === undefined) {
        showErrorDialog(`Launch options not configured on profile for "${os}"!`);
        return;
    }

    let customArguments: string[] = [];
    if (activeProfile.launchArguments.trim().length > 0) {
        customArguments = activeProfile.launchArguments.trim().split(" ");
    }

    const otherArguments: string[] = [];

    if (launchOptions.offlineArgument !== undefined && useOfflineStatus.getState().isOffline) {
        otherArguments.push(launchOptions.offlineArgument);
    }

    if (launchOptions.downloadLocationArgument !== undefined) {
        otherArguments.push(launchOptions.downloadLocationArgument);
        otherArguments.push(settingsManager.getCache("downloadLocation"));
    }

    try {
        await invoke("launch_profile", {
            profilePath: profilePath,
            execPath: launchOptions.executablePath,
            useObsVkcapture: os === "linux" && activeProfile.useObsVkcapture,
            arguments: [...launchOptions.arguments, getApiLaunchArgument(activeProfile.graphicsApi), ...otherArguments, ...customArguments]
        });
    } catch (e) {
        showErrorDialog(e as string);
    }
};

export const openInstallFolder = async (activeProfile: ActiveProfile, profilePath: string): Promise<void> => {
    if (activeProfile.profile.type !== "application") {
        showErrorDialog(`Cannot open install folder of type "${activeProfile.profile.type}"!`);
        return;
    }

    try {
        await invoke("open_folder_profile", {
            profilePath: profilePath
        });
    } catch (e) {
        showErrorDialog(e as string);
    }
};

export const promptDownloadMsvc = async (
    onProgress?: (payload: TaskPayload) => void): Promise<boolean> => {
    const result = await createAndShowDialog(MsvcDialog);

    if (result === "continue") {
        let unlistenFn: UnlistenFn | undefined;
        try {
            if (onProgress) {
                unlistenFn = await listen("progress_info", (event) => {
                    onProgress(event.payload as TaskPayload);
                });
            }

            await invoke("download_and_install_msvc");
            return true;
        } catch (e) {
            showErrorDialog(e as string);
            return false;
        } finally {
            if (unlistenFn) {
                unlistenFn();
            }
        }
    }

    return false;
};
