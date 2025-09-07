import {invoke} from "@tauri-apps/api/core";

export async function checkMsvc(): Promise<boolean> {
    return await invoke("is_msvcp_install_required");
}