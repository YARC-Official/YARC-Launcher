import { Profile } from "@app/stores/ProfileTypes";
import { v4 as generateUUID } from "uuid";

export interface IBaseTask {
    startedAt?: Date;
    taskUUID: string;

    profile: Profile;
    profilePath: string;

    onFinish?: () => void;

    start(): Promise<void>;
    getQueueEntry(bannerMode: boolean): React.ReactNode;
}

export class BaseTask {
    startedAt?: Date;
    taskUUID: string;

    profile: Profile;
    profilePath: string;

    constructor(profile: Profile, profilePath: string) {
        this.taskUUID = generateUUID();

        this.profile = profile;
        this.profilePath = profilePath;
    }
}
