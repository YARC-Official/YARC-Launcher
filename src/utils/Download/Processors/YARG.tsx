import { invoke } from "@tauri-apps/api/tauri";
import { BaseDownload, IBaseDownload } from "./base";
import YARGQueue from "@app/components/Queue/QueueDownload/YARG";

export class YARGDownload extends BaseDownload implements IBaseDownload {
    zipUrl: string;
    sigUrl?: string;
    version: string;
    onFinish: () => void;

    constructor(zipUrl: string, sigUrl: string | undefined, version: string, onFinish: () => void) {
        super(generateYARGUUID(version));
        this.zipUrl = zipUrl;
        this.sigUrl = sigUrl;
        this.version = version;
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        return await invoke("download_yarg", {
            zipUrl: this.zipUrl,
            sigUrl: this.sigUrl,
            versionId: this.version,
        });
    }

    getQueueEntry(): React.ReactNode {
        return <YARGQueue downloader={this} />;
    }
}

export function generateYARGUUID(version: string) {
    return `YARG_${version}`;
}