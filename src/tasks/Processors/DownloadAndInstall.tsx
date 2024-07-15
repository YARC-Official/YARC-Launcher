import { Profile } from "@app/stores/ProfileTypes";
import { BaseTask, IBaseTask } from "./base";
import { invoke } from "@tauri-apps/api";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { ReactNode } from "react";
import QueueEntry from "@app/components/Queue/QueueEntry";

export class DownloadAndInstallTask extends BaseTask implements IBaseTask {
    onFinish?: () => void;

    constructor(profile: Profile, profilePath: string, tempPath: string, onFinish?: () => void) {
        super(profile, profilePath, tempPath);
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        console.log("Downloading profile...");
        try {
            await invoke("download_and_install_profile", {
                profilePath: this.profilePath,
                uuid: this.profile.uuid,
                version: this.profile.version,
                tempPath: this.tempPath,
                content: this.profile.content
            });
        } catch (e) {
            showErrorDialog(e as string);
        }
    }

    getQueueEntry(bannerMode: boolean): ReactNode {
        if (this.profile.type === "application") {
            const metadata = this.profile.metadata.locales["en-US"];

            return <QueueEntry
                name={metadata.name}
                releaseName={metadata.releaseName}
                version={this.profile.version}
                bannerMode={bannerMode} />;
        } else {
            const metadata = this.profile.metadata.locales["en-US"];

            return <QueueEntry
                name={metadata.name}
                version={this.profile.version}
                bannerMode={bannerMode} />;
        }
    }
}
