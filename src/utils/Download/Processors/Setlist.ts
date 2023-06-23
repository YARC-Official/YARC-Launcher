import { invoke } from "@tauri-apps/api/tauri";
import { BaseDownload, IBaseDownload } from "./base";

export class SetlistDownload extends BaseDownload implements IBaseDownload {
    zipUrls: string[];
    id: string;
    version: string;
    onFinish: () => void;

    constructor(zipUrls: string[], id: string, version: string, onFinish: () => void) {
        super(generateSetlistUUID(id, version));
        this.zipUrls = zipUrls;
        this.id = id;
        this.version = version;
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        return await invoke("download_setlist", {
            zipUrls: this.zipUrls,
            id: this.id,
            version: this.version,
        });
    }
}

export function generateSetlistUUID(id: string, version: string) {
    return `setlist_${id}_${version}`;
}