import { appWindow } from "@tauri-apps/api/window";
import styles from "./TitleBar.module.css";
import { CloseIcon, MinimizeIcon } from "@app/assets/Icons";
import { TryCloseDialog } from "@app/dialogs/Dialogs/TryCloseDialog";
import { useCurrentTask } from "@app/tasks";
import { createAndShowDialog } from "@app/dialogs";
import YARCLogo from "@app/assets/YARC.svg?react";
import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";

const TitleBar: React.FC = () => {
    const [launcherVersion, setLauncherVersion] = useState("");
    const currentTask = useCurrentTask();

    useEffect(() => {
        (async () => {
            setLauncherVersion(await getVersion());
        })();
    }, []);

    async function tryClose() {
        // If there is no download, just close
        if (!currentTask?.startedAt) {
            appWindow.close();
            return;
        }

        // If there is one, show alert
        const output = await createAndShowDialog(TryCloseDialog);
        if (output === "close") {
            appWindow.close();
        }
    }

    return <div data-tauri-drag-region className={styles.titleBar}>
        <div className={styles.title}>
            <YARCLogo />
            Launcher
            {launcherVersion !== "" &&
                <div className={styles.version}>
                    {launcherVersion}
                </div>
            }
        </div>

        <div className={styles.controls}>
            <div onClick={() => appWindow.minimize()} className={styles.control}>
                <MinimizeIcon />
            </div>

            <div onClick={() => tryClose()} className={styles.control}>
                <CloseIcon />
            </div>
        </div>
    </div>;
};

export default TitleBar;
