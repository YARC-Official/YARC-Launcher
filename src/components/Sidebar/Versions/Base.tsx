import styles from "./Versions.module.css";

interface Props {
    icon?: React.ReactNode;
    programName?: string;
    versionChannel?: string;
    version?: string;
    updateAvailable?: boolean;
}

const BaseVersion: React.FC<Props> = ({ icon, programName, versionChannel, version, updateAvailable }) => {
    return <div className={styles.selector}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.text}>
            <div className={styles.channel}>{versionChannel}</div>
            <div className={styles.name}>{programName}</div>
        </div>
        <div className={styles.version} data-update-available={updateAvailable}>{version}</div>
    </div>;
}

export default BaseVersion;