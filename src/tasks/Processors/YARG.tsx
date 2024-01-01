import { invoke } from "@tauri-apps/api/tauri";
import { BaseTask, IBaseTask } from "./base";
import YARGQueue from "@app/components/Queue/QueueEntry/YARG";
import { YARGChannels } from "@app/hooks/useYARGRelease";

export abstract class YARGTask extends BaseTask {
    channel: YARGChannels;
    version: string;
    profile: string;
    onFinish: () => void;

    constructor(channel: YARGChannels, version: string, profile: string, onFinish: () => void) {
        super("yarg", profile);

        this.channel = channel;
        this.version = version;
        this.profile = profile;
        this.onFinish = onFinish;
    }

    getQueueEntry(bannerMode: boolean): React.ReactNode {
        return <YARGQueue yargTask={this} bannerMode={bannerMode} />;
    }
}

export class YARGDownload extends YARGTask implements IBaseTask {
    zipUrl: string;
    sigUrl?: string;

    constructor(zipUrl: string, sigUrl: string | undefined, channel: YARGChannels, version: string,
        profile: string, onFinish: () => void) {

        super(channel, version, profile, onFinish);

        this.zipUrl = zipUrl;
        this.sigUrl = sigUrl;
    }

    async start(): Promise<void> {
        let sigUrls: string[] = [];
        if (this.sigUrl != null) {
            sigUrls = [ this.sigUrl ];
        }

        return await invoke("download_and_install", {
            appName: "yarg",
            version: this.version,
            profile: this.profile,
            zipUrls: [ this.zipUrl ],
            sigUrls: sigUrls,
        });
    }
}

export class YARGUninstall extends YARGTask implements IBaseTask {
    constructor(channel: YARGChannels, version: string, profile: string, onFinish: () => void) {
        super(channel, version, profile, onFinish);
    }

    async start(): Promise<void> {
        return await invoke("uninstall", {
            appName: "yarg",
            version: this.version,
            profile: this.profile
        });
    }
}