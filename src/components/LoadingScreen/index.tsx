import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";
import * as Progress from "@radix-ui/react-progress";
import { error as logError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";
import { useProfileStore } from "@app/profiles/store";
import { settingsManager } from "@app/settings";
import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { launch } from "@app/profiles/actions";
import { getPathForProfile } from "@app/profiles/utils";
import { useDirectories } from "@app/profiles/directories";
import { showErrorDialog } from "@app/dialogs";

enum LoadingState {
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
    const [loading, setLoading] = useState(LoadingState.LOADING);

    // Load
    useEffect(() => {
        (async () => {
            try {
                // Make sure to save the settings afterwards in case a new key has been added
                // If "get" is called and the settings didn't save, it would cause an error.
                await settingsManager.initialize();
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

                await profileStore.activateProfilesFromSettings();
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
    return <div className={styles.container} style={{opacity: loading ? 0 : 1}}>
        <Progress.Root className={styles.progressRoot}>
            <Progress.Indicator className={styles.progressIndicator} />
        </Progress.Root>

        <div className={styles.factContainer}>
            {loading == LoadingState.LAUNCHING ?
                <>
                    <p className={styles.factHeader}>Launching...</p>
                    Sit tight...
                </> :
                <>
                    <p className={styles.factHeader}>Fun Fact</p>
                    YARG stands for Yet Another Rhythm Game
                </>
            }

        </div>
    </div>;
};

export default LoadingScreen;
