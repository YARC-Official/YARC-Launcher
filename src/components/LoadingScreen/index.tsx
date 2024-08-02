import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";
import * as Progress from "@radix-ui/react-progress";
import { error as logError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";
import { getPathForProfile, useProfileStore } from "@app/stores/ProfileStore";
import { settingsManager } from "@app/settings";
import { invoke } from "@tauri-apps/api";
import { getOS } from "@app/utils/os";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { appWindow } from "@tauri-apps/api/window";

enum LoadingState {
    "LOADING",
    "LAUNCHING",
    "FADE_OUT",
    "DONE"
}

interface Props {
    setError: React.Dispatch<unknown>;
    setOnboarding: React.Dispatch<boolean>;
}

const LoadingScreen: React.FC<Props> = (props: Props) => {
    const [loading, setLoading] = useState(LoadingState.LOADING);
    let profileStore = useProfileStore();

    // Load
    useEffect(() => {
        (async () => {
            try {
                await settingsManager.initialize();

                if (!settingsManager.getCache("onboardingCompleted")) {
                    profileStore = await profileStore.setDirs();
                    props.setOnboarding(true);
                } else {
                    const downloadLocation = settingsManager.getCache("downloadLocation");
                    profileStore = await profileStore.setDirs(downloadLocation);
                }
                console.log(profileStore.customDirs);
                
                // Check if a profile was requested to be launched by cmdline arguments
                const launchOption: string = await invoke("get_launch_argument");
                //console.log(launch_option);
                if (launchOption) {
                    setLoading(LoadingState.LAUNCHING);
                    
                    const profile = profileStore.getProfileByUUID(launchOption);
                    if (profile) {
                        if (profile.type !== "application") {
                            showErrorDialog(`The specified profile (${profile.uuid}) is not an application.`);
                            return;
                        }
                        
                        const os = await getOS();
                        const launchOptions = profile.launchOptions[os];
                        if (launchOptions === undefined) {
                            showErrorDialog(`Launch options not configured on profile for "${os}"!`);
                            return;
                        }
    
                        const profilePath = await getPathForProfile(profileStore, profile);
                        
                        try {
                            await invoke("launch_profile", {
                                profilePath: profilePath,
                                execPath: launchOptions.executablePath,
                                arguments: launchOptions.arguments
                            });
                            appWindow.close();
                        } catch (e) {
                            showErrorDialog(e as string);
                        }
                    } else {
                        showErrorDialog("Invalid profile specified: " + launchOption);
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
