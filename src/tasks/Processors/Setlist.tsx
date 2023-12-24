import { invoke } from "@tauri-apps/api/tauri";
import { BaseTask, IBaseTask } from "./base";
import SetlistQueue from "@app/components/Queue/QueueEntry/Setlist";

export class SetlistDownload extends BaseTask implements IBaseTask {
    zipUrls: string[];
    profile: string;
    version: string;
    onFinish: () => void;

    constructor(zipUrls: string[], profile: string, version: string, onFinish: () => void) {
        super("setlist", profile);

        this.zipUrls = zipUrls;
        this.profile = profile;
        this.version = version;
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        return await invoke("download_and_install", {
            appName: "official_setlist",
            version: this.version,
            profile: this.profile,
            zipUrls: this.zipUrls,
            sigUrls: [],
        });
    }

    getQueueEntry(bannerMode: boolean): React.ReactNode {
        return <SetlistQueue downloader={this} bannerMode={bannerMode} />;
    }
}