import { invoke } from "@tauri-apps/api/tauri";
import { BaseTask, IBaseTask } from "./base";
import SetlistQueue from "@app/components/Queue/QueueEntry/Setlist";

export class SetlistDownload extends BaseTask implements IBaseTask {
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
        return await invoke("download_and_install", {
            appName: "official_setlist",
            version: this.version,
            profile: this.id,
            zipUrls: this.zipUrls,
            sigUrls: [],
        });
    }

    getQueueEntry(bannerMode: boolean): React.ReactNode {
        return <SetlistQueue downloader={this} bannerMode={bannerMode} />;
    }
}

export function generateSetlistUUID(id: string, version: string) {
    return `setlist_${id}_${version}`;
}