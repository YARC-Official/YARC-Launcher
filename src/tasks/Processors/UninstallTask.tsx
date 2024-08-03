import { Profile } from "@app/profiles/types";
import { BaseTask, IBaseTask } from "./base";
import { invoke } from "@tauri-apps/api";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { ReactNode } from "react";
import QueueEntry from "@app/components/Queue/QueueEntry";

export class UninstallTask extends BaseTask implements IBaseTask {
    onFinish?: () => void;

    constructor(profile: Profile, profilePath: string, onFinish?: () => void) {
        super(profile, profilePath);
        this.onFinish = onFinish;
    }

    async start(): Promise<void> {
        try {
            await invoke("uninstall_profile", {
                profilePath: this.profilePath
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
