import { createAndShowDialog } from "@app/dialogs";
import { LeavingLauncherDialog } from "@app/dialogs/Dialogs/LeavingLauncherDialog";
import { open } from "@tauri-apps/api/shell";

export async function askOpenUrl(url: string) {
    await createAndShowDialog(LeavingLauncherDialog, { url });
}

export function openUrl(url: string) {
    open(url);
}
