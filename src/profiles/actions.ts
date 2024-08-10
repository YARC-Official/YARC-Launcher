import { DownloadAndInstallTask } from "@app/tasks/Processors/DownloadAndInstallTask";
import { ActiveProfile } from "./types";
import { addTask } from "@app/tasks";
import { UninstallTask } from "@app/tasks/Processors/UninstallTask";
import { getOS } from "@app/utils/os";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { invoke } from "@tauri-apps/api";
import { getProfileVersion } from "./utils";
import { useDirectories } from "./directories";

export const downloadAndInstall = async (profile: ActiveProfile, profilePath: string, onFinish?: () => void): Promise<void> => {
    const directories = useDirectories.getState();
    if (directories.importantDirs === undefined) {
        return;
    }

    const version = getProfileVersion(profile);
    const tempFolder = directories.importantDirs.tempFolder;
    const task = new DownloadAndInstallTask(profile, version, profilePath, tempFolder, onFinish);
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

    const version = getProfileVersion(activeProfile);

    const os = await getOS();
    const launchOptions = version.launchOptions?.[os];
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
