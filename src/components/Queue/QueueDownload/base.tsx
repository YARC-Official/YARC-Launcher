import { DownloadPayload } from "@app/utils/Download";
import styles from "./QueueDownload.module.css";
import PayloadProgress from "../../PayloadProgress";

interface Props {
    icon?: React.ReactNode;
    name?: string;
    versionChannel?: string;
    version?: string;
    payload?: DownloadPayload;
}

const BaseQueue: React.FC<Props> = ({ icon, name, versionChannel, version, payload }: Props) => {
    return <div className={styles.item}>
        <div className={styles.main}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.info}>
                <span className={styles.info_header}>{name} {version}</span>
                {versionChannel}
            </div>
        </div>
        <div className={styles.extra}>
        </div>
    </div>;
};

export default BaseQueue;