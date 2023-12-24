import { v4 as generateUUID } from "uuid";

export type TaskTag = "yarg" | "setlist";

export interface IBaseTask {
    taskUUID: string,
    taskTag: TaskTag,
    profile: string,

    onFinish?: () => void;

    start(): Promise<void>;
    getQueueEntry(bannerMode: boolean): React.ReactNode;
}

export class BaseTask {
    taskUUID: string;
    taskTag: TaskTag;
    profile: string;

    constructor(taskTag: TaskTag, profile: string) {
        this.taskUUID = generateUUID();
        this.taskTag = taskTag;
        this.profile = profile;
    }
}