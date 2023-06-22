import { DownloadPayload } from "@app/utils/Download";

interface Props {
    payload?: DownloadPayload;
}

const PayloadProgress: React.FC<Props> = ({payload}: Props) => {
    if(!payload) return <></>;

    return payload.state === "downloading" ? <ProgressDownloading payload={payload} /> :
        payload.state === "installing" ? <ProgressInstalling /> :
            <ProgressWaiting />;
};

const ProgressWaiting: React.FC = () => {
    return (<span>On queue</span>);
};

interface ProgressDownloadingProps {
    payload: DownloadPayload;
}

const ProgressDownloading: React.FC<ProgressDownloadingProps> = ({payload}: ProgressDownloadingProps) => {
    return (<span>{(payload?.current / payload?.total) * 100}%</span>);
};

const ProgressInstalling: React.FC = () => {
    return (<span>Installing</span>);
};

export default PayloadProgress;