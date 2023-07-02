import { DownloadPayload } from "@app/utils/Download";

interface Props {
    payload?: DownloadPayload;
    defaultText?: string;
}

const PayloadProgress: React.FC<Props> = ({ payload, defaultText }: Props) => {
    if (!payload) {
        return <span>{defaultText}</span>;
    }

    switch (payload.state) {
        case "downloading":
            return <ProgressDownloading payload={payload} />;
        case "installing":
            return <ProgressInstalling />;
        case "verifying":
            return <ProgressVerifying />;
        default:
            return <ProgressWaiting />;
    }
};

const ProgressWaiting: React.FC = () => {
    return (<span>Queued</span>);
};

interface ProgressDownloadingProps {
    payload: DownloadPayload;
}

const ProgressDownloading: React.FC<ProgressDownloadingProps> = ({ payload }: ProgressDownloadingProps) => {
    return (<span>{((payload?.current / payload?.total) * 100).toFixed(0)}%</span>);
};

const ProgressInstalling: React.FC = () => {
    return (<span>Installing</span>);
};

const ProgressVerifying: React.FC = () => {
    return (<span>Verifying</span>);
};

export default PayloadProgress;