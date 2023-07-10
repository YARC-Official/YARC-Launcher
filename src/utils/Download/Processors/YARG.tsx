import { invoke } from "@tauri-apps/api/tauri";
import { BaseDownload, IBaseDownload } from "./base";
import YARGQueue from "@app/components/Queue/QueueEntry/YARG";
import { YARGChannels } from "@app/hooks/useYARGRelease";

export class YARGDownload extends BaseDownload implements IBaseDownload {
    zipUrl: string;
    sigUrl?: string;
    channel: YARGChannels;
    version: string;
    profile: string;
    onFinish: () => void;

    constructor(zipUrl: string, sigUrl: string | undefined, channel: YARGChannels, version: string, profile: string, onFinish: () => void) {
        super(generateYARGUUID(version));
        this.zipUrl = zipUrl;
        this.sigUrl = sigUrl;
        this.channel = channel;
        this.version = version;
        this.profile = profile;
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        return await invoke("download_yarg", {
            zipUrl: this.zipUrl,
            sigUrl: this.sigUrl,
            versionId: this.version,
            profile: this.profile
        });
    }

    getQueueEntry(bannerMode: boolean): React.ReactNode {
        return <YARGQueue downloader={this} bannerMode={bannerMode} />;
    }
}

export function generateYARGUUID(version: string) {
    return `YARG_${version}`;
}