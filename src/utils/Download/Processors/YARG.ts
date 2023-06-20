import { invoke } from "@tauri-apps/api/tauri";
import { BaseDownload, IBaseDownload } from "./base";

export class YARGDownload extends BaseDownload implements IBaseDownload {
    zipUrl: string;
    version: string;
    onFinish: () => void;

    constructor(zipUrl: string, version: string, onFinish: () => void) {
        super(generateYARGUUID(version));
        this.zipUrl = zipUrl;
        this.version = version;
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        return await invoke("download_yarg", {
            zipUrl: this.zipUrl,
            versionId: this.version,
        });
    }
}

export function generateYARGUUID(version: string) {
    return `YARG_${version}`;
}