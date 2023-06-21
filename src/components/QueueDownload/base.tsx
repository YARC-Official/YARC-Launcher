import { DownloadPayload } from "@app/utils/Download";
import styles from "./QueueDownload.module.css";
import PayloadProgress from "../PayloadProgress";

interface Props {
    icon?: React.ReactNode;
    name?: string;
    versionChannel?: string;
    version?: string;
    payload?: DownloadPayload;
}

const BaseQueue: React.FC<Props> = ({icon, name, versionChannel, version, payload}: Props) => {
    return <div className={styles.queue}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.info}>
            <div className={styles.channel}>{versionChannel}</div>
            <div className={styles.name}>{name}</div>
        </div>
        <div className={styles.version}>{version}</div>
        <div className={styles.progress}>
            <PayloadProgress payload={payload}/>
        </div>
    </div>;
};


export default BaseQueue;