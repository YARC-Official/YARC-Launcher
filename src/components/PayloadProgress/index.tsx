import { DownloadPayload } from "@app/tasks";

interface Props {
    payload?: DownloadPayload;
    defaultText?: string;
    fullMode?: boolean;
}

const PayloadProgress: React.FC<Props> = ({ payload, defaultText = "Loading", fullMode }: Props) => {
    if (!payload) {
        return <span>{defaultText}</span>;
    }

    switch (payload.state) {
        case "downloading":
            return <ProgressDownloading payload={payload} fullMode={fullMode} />;
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
    fullMode?: boolean;
}

const ProgressDownloading: React.FC<ProgressDownloadingProps> = ({ payload, fullMode }: ProgressDownloadingProps) => {
    return <span>
        {fullMode &&
            "Downloading "
        }
        {((payload?.current / payload?.total) * 100).toFixed(0)}%
    </span>;
};

const ProgressInstalling: React.FC = () => {
    return (<span>Installing</span>);
};

const ProgressVerifying: React.FC = () => {
    return (<span>Verifying</span>);
};

export default PayloadProgress;