export interface IBaseDownload {
    uuid: string,
    onFinish?: () => void;

    start(): Promise<void>;
    getQueueEntry(bannerMode: boolean): React.ReactNode;
}

export class BaseDownload {
    uuid: string;

    constructor(uuid: string) {
        this.uuid = uuid;
    }
}