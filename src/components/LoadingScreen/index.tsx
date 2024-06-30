import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";
import * as Progress from "@radix-ui/react-progress";
import { error as logError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";
import { invoke } from "@tauri-apps/api/tauri";
import { CustomDirs, ImportantDirs, useProfileStore } from "@app/stores/ProfileStore";

enum LoadingState {
    "LOADING",
    "FADE_OUT",
    "DONE"
}

interface Props {
    setError: React.Dispatch<unknown>;
}

const LoadingScreen: React.FC<Props> = (props: Props) => {
    const [loading, setLoading] = useState(LoadingState.LOADING);
    const profileStore = useProfileStore();

    // Load
    useEffect(() => {
        (async () => {
            try {
                // Get the important and custom directories
                const importantDirs = await invoke("get_important_dirs");
                const customDirs = await invoke("get_custom_dirs", {
                    downloadLocation: "F:/test/"
                });

                // Set the directories within the store
                profileStore.setDirs(importantDirs as ImportantDirs, customDirs as CustomDirs);

                console.log(importantDirs);
                console.log(customDirs);

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
            <p className={styles.factHeader}>Fun Fact</p>
            YARG stands for Yet Another Rhythm Game
        </div>
    </div>;
};

export default LoadingScreen;
