import {check} from "@tauri-apps/plugin-updater";
import {relaunch} from "@tauri-apps/plugin-process";
import {confirm} from "@tauri-apps/plugin-dialog";

async function CheckForUpdates() {
    const update = await check();

    if (update) {
        const confirmed = await confirm("Would you like to update now?", "Launcher Update Available");
        if (confirmed) {
            await update.downloadAndInstall();
            await relaunch();
        }
    }
}

export default CheckForUpdates;