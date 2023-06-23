import ApplicationStyles from "./styles/Application.module.css";
import SongStyles from "./styles/Song.module.css";

export enum VersionType {
    "APPLICATION",
    "SONG"
}

interface Props {
    type?: VersionType,
    icon?: React.ReactNode;
    programName?: string;
    versionChannel?: string;
    version?: string;
    updateAvailable?: boolean;
}

const styleType = {
    [VersionType.APPLICATION]: ApplicationStyles,
    [VersionType.SONG]: SongStyles
};

const BaseVersion: React.FC<Props> = ({ type = VersionType.APPLICATION, icon, programName, versionChannel, updateAvailable }: Props) => {
    const styles = styleType[type];

    return <div className={styles.selector}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.text}>
            <div className={styles.channel}>{versionChannel}</div>
            <div className={styles.name}>{programName}</div>
        </div>
        <div className={styles.version} data-update-available={updateAvailable}></div>
    </div>;
};

export default BaseVersion;