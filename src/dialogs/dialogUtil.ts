import { invoke } from "@tauri-apps/api";
import { InstallFolderDialog } from "./Dialogs/InstallFolderDialog";
import { ErrorDialog } from "./Dialogs/ErrorDialog";
import { createAndShowDialog } from ".";

export async function showInstallFolderDialog() {
    if (!await invoke("is_initialized")) {
        const dialogOutput = await createAndShowDialog(InstallFolderDialog);

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

export async function showErrorDialog(error: string) {
    await createAndShowDialog(ErrorDialog, { error: error });
}