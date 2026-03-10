import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";
import * as Progress from "@radix-ui/react-progress";
import { error as logError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";
import { useProfileStore } from "@app/profiles/store";
import { settingsManager } from "@app/settings";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { launch } from "@app/profiles/actions";
import { getPathForProfile } from "@app/profiles/utils";
import { useDirectories } from "@app/profiles/directories";
import { createAndShowDialog, showErrorDialog } from "@app/dialogs";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";
import { OfflineDialog } from "@app/dialogs/Dialogs/OfflineDialog";
import { remove } from "@tauri-apps/plugin-fs";
import { appConfigDir, join } from "@tauri-apps/api/path";
import CheckForUpdates from "@app/components/Updater";

const appWindow = getCurrentWebviewWindow();

enum LoadingState {
    "CHECKING_UPDATES",
    "LOADING",
    "LAUNCHING",
    "FADE_OUT",
    "DONE"
}

interface Props {
    setError: React.Dispatch<unknown>;
    setOnboarding: React.Dispatch<boolean>;
    setShowBody: React.Dispatch<boolean>;
}

const LoadingScreen: React.FC<Props> = (props: Props) => {
    const [loading, setLoading] = useState(LoadingState.CHECKING_UPDATES);

    // Load
    useEffect(() => {
        (async () => {
            try {
                const offline = !await invoke("is_connected_to_internet");
                if (offline) {
                    const offlineStatus = useOfflineStatus.getState();
                    offlineStatus.setOffline(true);
                } else {
                    try {
                        await CheckForUpdates();
                    } catch (e) {
                        console.error("Update check failed:", e);
                        logError(`Update check failed: ${JSON.stringify(serializeError(e))}`);
                    }
                }

                setLoading(LoadingState.LOADING);

                // Make sure to save the settings afterwards in case a new key has been added
                // If "get" is called and the settings didn't save, it would cause an error.
                // Along with this, it's possible for `initialize` to fail if the file gets
                // corrupted. If it does fail, delete the settings file and try again.
                try {
                    await settingsManager.initialize();
                } catch {
                    try {
                        await remove(await join(await appConfigDir(), "settings.json"));
                    } catch {
                        // This may fail while in dev mode as this function may be ran twice
                    }

                    await settingsManager.initialize();
                    showErrorDialog(
                        "The launcher settings file was corrupted, so it had to be deleted. Because of this, " +
                        "you will have to restart the onboarding process. Apologies for the inconvenience.");
                }
                await settingsManager.syncCache();

                const onboardingCompleted = settingsManager.getCache("onboardingCompleted");

                let profileStore = useProfileStore.getState();
                let directories = useDirectories.getState();

                let downloadLocation: string | undefined = undefined;
                if (onboardingCompleted) {
                    downloadLocation = settingsManager.getCache("downloadLocation");
                }

                await directories.setDirs(downloadLocation);
                directories = useDirectories.getState();

                await new Promise(r => setTimeout(r, 0));

                let result: string | undefined;
                if (directories.downloadLocationInvalid) {
                    do {
                        result = await showErrorDialog("The download location is invalid. This is likely because your download location is on a removable drive or the launcher does not have permission to write to it. If you are using a removable drive, please plug it in and click retry. Otherwise, click Okay to restart the onboarding process.",
                            true);

                        if (result == "retry") {
                            await directories.setDirs(downloadLocation);
                            directories = useDirectories.getState();
                        }
                    } while (result === "retry");

                    // User gave up retrying and download location is still invalid, so restart onboarding
                    if (directories.downloadLocationInvalid) {
                        await showErrorDialog("Due to an invalid download location the launcher will be reinitialized. Once you click Okay all settings will be lost and you will restart the onboarding process. If your launcher was previously working and you want to attempt recovery, do not click Okay and instead close the launcher.");

                        try {
                            await remove(await join(await appConfigDir(), "settings.json"));
                        } catch {
                            // This may fail while in dev mode as this function may be ran twice
                        }

                        await settingsManager.initialize();
                        window.location.reload();
                    }
                }

                await profileStore.activateProfilesFromSettings(offline);
                profileStore = useProfileStore.getState();

                if (!onboardingCompleted) {
                    props.setOnboarding(true);
                } else {
                    // Check if a profile was requested to be launched by command line arguments
                    const launchOption: string | null = await invoke("get_launch_argument");
                    if (launchOption !== null) {
                        setLoading(LoadingState.LAUNCHING);

                        const profile = profileStore.getProfileByUUID(launchOption);
                        if (profile) {
                            const path = await getPathForProfile(directories, profile);
                            await launch(profile, path);

                            appWindow.close();
                        } else {
                            showErrorDialog("Invalid profile specified: " + launchOption);
                        }
                    }
                }

                // Add a tiny bit of delay so the loading screen doesn't just instantly disappear
                await new Promise(r => setTimeout(r, 250));

                if (offline) {
                    createAndShowDialog(OfflineDialog);
                }
            } catch (e) {
                console.error(e);
                logError(JSON.stringify(serializeError(e)));

                // If there's an error, just instantly hide the loading screen
                props.setError(e);
                setLoading(LoadingState.DONE);

                return;
            }

            props.setShowBody(true);

            // The loading screen takes 250ms to fade out
            setLoading(LoadingState.FADE_OUT);
            await new Promise(r => setTimeout(r, 250));

            // Done!
            setLoading(LoadingState.DONE);
        })();
    }, []);

    // Don't display anything if done
    if (loading == LoadingState.DONE) {
        return <></>;
    }

    // Display loading screen
    return <div className={styles.container} style={{opacity: loading === LoadingState.FADE_OUT  ? 0 : 1}}>
        <Progress.Root className={styles.progressRoot}>
            <Progress.Indicator className={styles.progressIndicator} />
        </Progress.Root>

        <div className={styles.factContainer}>
            {loading == LoadingState.LAUNCHING ? (
                <>
                    <p className={styles.factHeader}>Launching...</p>
                    Sit tight...
                </>
            ) : loading === LoadingState.CHECKING_UPDATES ? (
                <>
                    <p className={styles.factHeader}>Checking for Updates...</p>
                    Sit tight...
                </>
            ) : (
                <>
                    <p className={styles.factHeader}>Fun Fact</p>
                    YARG stands for Yet Another Rhythm Game
                </>
            )}

        </div>
    </div>;
};

export default LoadingScreen;
