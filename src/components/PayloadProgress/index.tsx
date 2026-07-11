import { TaskPayload } from "@app/tasks/payload";

interface Props {
    payload?: TaskPayload;
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
            return <ProgressInstalling payload={payload} fullMode={fullMode} />;
        case "verifying":
            return <ProgressVerifying />;
        default:
            return <ProgressWaiting />;
    }
};

const ProgressWaiting: React.FC = () => {
    return (<span>Queued</span>);
};

interface ProgressProps {
    payload: TaskPayload;
    fullMode?: boolean;
}

const ProgressDownloading: React.FC<ProgressProps> = ({ payload, fullMode }: ProgressProps) => {
    return <span>
        {fullMode &&
            "Downloading "
        }
        {((payload?.current / payload?.total) * 100).toFixed(0)}%
    </span>;
};

const ProgressInstalling: React.FC<ProgressProps> = ({ payload, fullMode }: ProgressProps) => {
    const percentage = payload?.total > 0 ? (payload.current / payload.total) * 100 : 0;

    return <span>
        {fullMode &&
            "Installing "
        }
        {percentage.toFixed(0)}%
    </span>;
};

const ProgressVerifying: React.FC = () => {
    return (<span>Verifying</span>);
};

export default PayloadProgress;
