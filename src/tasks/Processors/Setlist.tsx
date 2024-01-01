import { invoke } from "@tauri-apps/api/tauri";
import { BaseTask, IBaseTask } from "./base";
import SetlistQueue from "@app/components/Queue/QueueEntry/Setlist";

export abstract class SetlistTask extends BaseTask {
    profile: string;
    version: string;
    onFinish: () => void;

    constructor(profile: string, version: string, onFinish: () => void) {
        super("setlist", profile);

        this.profile = profile;
        this.version = version;
        this.onFinish = onFinish;
    }

    getQueueEntry(bannerMode: boolean): React.ReactNode {
        return <SetlistQueue setlistTask={this} bannerMode={bannerMode} />;
    }
}

export class SetlistDownload extends SetlistTask implements IBaseTask {
    zipUrls: string[];

    constructor(zipUrls: string[], profile: string, version: string, onFinish: () => void) {
        super(profile, version, onFinish);

        this.zipUrls = zipUrls;
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
}

export class SetlistUninstall extends SetlistTask implements IBaseTask {
    constructor(profile: string, version: string, onFinish: () => void) {
        super(profile, version, onFinish);
    }

    async start(): Promise<void> {
        return await invoke("uninstall", {
            appName: "official_setlist",
            version: this.version,
            profile: this.profile
        });
    }
}