import { appWindow } from "@tauri-apps/api/window";

import styles from "./titlebar.module.css";
import { CloseIcon, MinimizeIcon } from "@app/assets/Icons";
import { useDialogManager } from "@app/dialogs/DialogProvider";
import { TryCloseDialog } from "@app/dialogs/Dialogs/TryCloseDialog";
import { useTaskClient } from "@app/tasks/provider";

const TitleBar: React.FC = () => {
    const dialogManager = useDialogManager();

    const taskClient = useTaskClient();
    const current = taskClient.useCurrent();

    async function tryClose() {
        // If there is no download, just close
        if (!current) {
            appWindow.close();
            return;
        }

        // If there is one, show alert
        const output = await dialogManager.createAndShowDialog(TryCloseDialog);
        if (output === "close") {
            appWindow.close();
        }
    }

    return <div data-tauri-drag-region className={styles.title_bar}>
        <div className={styles.text}>
            YARC Launcher
        </div>

        <div className={styles.buttons}>
            <div onClick={() => appWindow.minimize()} className={styles.button}>
                <MinimizeIcon />
            </div>

            <div onClick={() => tryClose()} className={styles.button}>
                <CloseIcon />
            </div>
        </div>
    </div>;
};

export default TitleBar;