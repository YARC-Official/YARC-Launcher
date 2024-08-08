import { Profile, Version } from "@app/profiles/types";
import { BaseTask, IBaseTask } from "./base";
import { invoke } from "@tauri-apps/api";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { ReactNode } from "react";
import QueueEntry from "@app/components/Queue/QueueEntry";
import { localizeObject } from "@app/utils/localized";

export class DownloadAndInstallTask extends BaseTask implements IBaseTask {
    onFinish?: () => void;

    version: Version;
    tempPath: string;

    constructor(profile: Profile, version: Version, profilePath: string, tempPath: string, onFinish?: () => void) {
        super(profile, profilePath);

        this.onFinish = onFinish;

        this.version = version;
        this.tempPath = tempPath;
    }

    async start(): Promise<void> {
        try {
            await invoke("download_and_install_profile", {
                profilePath: this.profilePath,
                uuid: this.profile.uuid,
                tag: this.version.tag,
                tempPath: this.tempPath,
                content: this.version.content
            });
        } catch (e) {
            showErrorDialog(e as string);
        }
    }

    getQueueEntry(bannerMode: boolean): ReactNode {
        if (this.profile.type === "application") {
            const metadata = localizeObject(this.profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                releaseName={metadata.releaseName}
                tag={this.version.tag}
                bannerMode={bannerMode} />;
        } else {
            const metadata = localizeObject(this.profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                tag={this.version.tag}
                bannerMode={bannerMode} />;
        }
    }
}
