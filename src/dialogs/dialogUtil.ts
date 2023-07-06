import { invoke } from "@tauri-apps/api";
import { DialogManager } from ".";
import { InstallFolderDialog } from "./Dialogs/InstallFolderDialog";
import { ErrorDialog } from "./Dialogs/ErrorDialog";

export async function showInstallFolderDialog(dialogManager: DialogManager) {
    if (!await invoke("is_initialized")) {
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

export async function showErrorDialog(dialogManager: DialogManager, error: string) {
    await dialogManager.createAndShowDialog(ErrorDialog, { error: error });
}