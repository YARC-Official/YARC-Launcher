import { invoke } from "@tauri-apps/api";
import { DialogManager } from ".";
import { InstallFolderDialog } from "./Dialogs/InstallFolderDialog";

export async function showInstallFolderDialog(dialogManager: DialogManager) {
    if (!await invoke("is_download_location_set")) {
        const dialogOutput = await dialogManager.createAndShowDialog(InstallFolderDialog);
        if (dialogOutput === "cancel") {
            return false;
        } else {
            try {
                await invoke("set_download_location", {
                    path: dialogOutput
                });
            } catch {
                return false;
            }
        }
    }

    return true;
}