export interface IBaseDownload {
    uuid: string,
    onFinish?: () => void;

    start(): Promise<void>;
}

export class BaseDownload {
    uuid: string;

    constructor(uuid: string) {
        this.uuid = uuid;
    }
}