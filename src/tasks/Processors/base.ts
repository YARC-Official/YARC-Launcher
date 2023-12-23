export interface IBaseTask {
    taskUUID: string,
    onFinish?: () => void;

    start(): Promise<void>;
    getQueueEntry(bannerMode: boolean): React.ReactNode;
}

export class BaseTask {
    taskUUID: string;

    constructor(taskUUID: string) {
        this.taskUUID = taskUUID;
    }
}