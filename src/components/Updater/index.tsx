import {check} from "@tauri-apps/plugin-updater";
import {relaunch} from "@tauri-apps/plugin-process";

async function CheckForUpdates() {
    const update = await check();

    if (update) {
        await update.downloadAndInstall();
        await relaunch();
    }
}

export default CheckForUpdates;