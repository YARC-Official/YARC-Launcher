import { ActiveProfile } from "@app/profiles/types";
import { BaseTask, IBaseTask } from "./base";
import { invoke } from "@tauri-apps/api/core";
import { ReactNode } from "react";
import QueueEntry from "@app/components/Queue/QueueEntry";
import { localizeObject } from "@app/utils/localized";
import { showErrorDialog } from "@app/dialogs";
import ProfileIcon from "@app/components/ProfileIcon";

export class DownloadAndInstallTask extends BaseTask implements IBaseTask {
    onFinish?: () => void;

    tempPath: string;

    constructor(profile: ActiveProfile, profilePath: string, tempPath: string, onFinish?: () => void) {
        super(profile, profilePath);

        this.onFinish = onFinish;

        this.tempPath = tempPath;
    }

    async start(): Promise<void> {
        try {
            await invoke("download_and_install_profile", {
                profilePath: this.profilePath,
                uuid: this.activeProfile.uuid,
                tag: this.activeProfile.version.tag,
                tempPath: this.tempPath,
                content: this.activeProfile.version.content
            });
        } catch (e) {
            showErrorDialog(e as string);
        }
    }

    getQueueEntry(bannerMode: boolean): ReactNode {
        const profile = this.activeProfile.profile;
        if (profile.type === "application") {
            const metadata = localizeObject(profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                releaseName={metadata.releaseName}
                tag={this.activeProfile.version.tag}
                icon={<ProfileIcon iconUrl={metadata.iconUrl} />}
                bannerMode={bannerMode} />;
        } else if (profile.type === "venue") {
            const metadata = localizeObject(profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                icon={<ProfileIcon iconUrl={metadata.iconUrl} />}
                bannerMode={bannerMode} />;
        } else {
            const metadata = localizeObject(profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                icon={<ProfileIcon iconUrl={metadata.iconUrl} />}
                bannerMode={bannerMode} />;
        }
    }
}
