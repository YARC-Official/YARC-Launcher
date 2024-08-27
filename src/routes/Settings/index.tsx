import Box from "@app/components/Box";
import styles from "./Settings.module.css";
import { useEffect, useState } from "react";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { OS, getOS } from "@app/utils/os";
import Button, { ButtonColor } from "@app/components/Button";
import { settingsManager } from "@app/settings";
import { createAndShowDialog } from "@app/dialogs";
import { ChangeDownloadLocationDialog } from "@app/dialogs/Dialogs/ChangeDownloadLocationDialog";
import { useProfileStore } from "@app/profiles/store";
import { invoke } from "@tauri-apps/api";
import { useDirectories } from "@app/profiles/directories";
import { getPathForProfile } from "@app/profiles/utils";
import { useCurrentTask } from "@app/tasks";
import { relaunch } from "@tauri-apps/api/process";

interface LauncherInfo {
    name: string;
    version: string;
    tauriVersion: string;
    os: OS;
}

function Settings() {
    const [launcherInfo, setLauncherInfo] = useState<LauncherInfo | undefined>(undefined);
    const [loadingState, setLoadingState] = useState<string | undefined>(undefined);

    const task = useCurrentTask();

    useEffect(() => {
        (async () => {
            setLauncherInfo({
                name: await getName(),
                version: `v${await getVersion()}`,
                tauriVersion: await getTauriVersion(),
                os: await getOS()
            });
        })();
    }, []);

    const downloadLocation = settingsManager.getCache("downloadLocation");

    return <main className={styles.mainContainer}>
        {loadingState !== undefined &&
            <div className={styles.loadingScreen}>
                {loadingState}
            </div>
        }

        <Box>
            <header>
                File Management
            </header>
            <div className={styles.downloadLocation}>
                <span>{downloadLocation}</span>
                {task !== undefined &&
                    <Button color={ButtonColor.LIGHT}>
                        Waiting For Queue...
                    </Button>
                }
                {task === undefined &&
                    <Button color={ButtonColor.YELLOW} border onClick={async () => {
                        const result = await createAndShowDialog(ChangeDownloadLocationDialog);
                        if (result !== "continue") {
                            return;
                        }

                        const directories = useDirectories.getState();

                        const profiles = useProfileStore.getState().activeProfiles;
                        for (let i = 0; i < profiles.length; i++) {
                            setLoadingState(`Uninstalling profile ${i + 1}/${profiles.length}...`);

                            try {
                                const path = await getPathForProfile(directories, profiles[i]);
                                await invoke("uninstall_profile", {
                                    profilePath: path
                                });
                            } catch {
                                // Ignore
                            }
                        }

                        setLoadingState("Finishing up...");

                        await settingsManager.set("downloadLocation", "");
                        await settingsManager.set("onboardingCompleted", false);

                        await relaunch();
                    }}>
                        Change Download Location
                    </Button>
                }
            </div>
        </Box>
        <Box>
            <header>
                About
            </header>
            <span>
                App: {launcherInfo?.name} {launcherInfo?.version}
            </span>
            <span>
                Tauri: {launcherInfo?.tauriVersion}
            </span>
            <span>
                OS: {launcherInfo?.os}
            </span>
        </Box>
    </main>;
}

export default Settings;
