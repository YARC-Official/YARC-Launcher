import { invoke } from "@tauri-apps/api/tauri";
import { BaseTask, IBaseTask } from "./base";
import YARGQueue from "@app/components/Queue/QueueEntry/YARG";
import { YARGChannels } from "@app/hooks/useYARGRelease";

export class YARGDownload extends BaseTask implements IBaseTask {
    zipUrl: string;
    sigUrl?: string;
    channel: YARGChannels;
    version: string;
    profile: string;
    onFinish: () => void;

    constructor(zipUrl: string, sigUrl: string | undefined, channel: YARGChannels, version: string,
        profile: string, onFinish: () => void) {

        super("yarg", profile);

        this.zipUrl = zipUrl;
        this.sigUrl = sigUrl;
        this.channel = channel;
        this.version = version;
        this.profile = profile;
        this.onFinish = onFinish;
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

    getQueueEntry(bannerMode: boolean): React.ReactNode {
        return <YARGQueue downloader={this} bannerMode={bannerMode} />;
    }
}