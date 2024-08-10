import { ActiveProfile } from "@app/profiles/types";
import { v4 as generateUUID } from "uuid";

export interface IBaseTask {
    startedAt?: Date;
    taskUUID: string;

    activeProfile: ActiveProfile;
    profilePath: string;

    onFinish?: () => void;

    start(): Promise<void>;
    getQueueEntry(bannerMode: boolean): React.ReactNode;
}

export class BaseTask {
    startedAt?: Date;
    taskUUID: string;

    activeProfile: ActiveProfile;
    profilePath: string;

    constructor(profile: ActiveProfile, profilePath: string) {
        this.taskUUID = generateUUID();

        this.activeProfile = profile;
        this.profilePath = profilePath;
    }
}
