import { ActiveProfile } from "@app/profiles/types";
import { BaseTask, IBaseTask } from "./base";
import { invoke } from "@tauri-apps/api";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { ReactNode } from "react";
import QueueEntry from "@app/components/Queue/QueueEntry";
import { localizeObject } from "@app/utils/localized";

export class UninstallTask extends BaseTask implements IBaseTask {
    onFinish?: () => void;

    constructor(profile: ActiveProfile, profilePath: string, onFinish?: () => void) {
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
        const profile = this.activeProfile.profile;
        if (profile.type === "application") {
            const metadata = localizeObject(profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                releaseName={metadata.releaseName}
                bannerMode={bannerMode} />;
        } else {
            const metadata = localizeObject(profile.metadata, "en-US");

            return <QueueEntry
                name={metadata.name}
                bannerMode={bannerMode} />;
        }
    }
}
