import stylesNormal from "./QueueDownload.module.css";
import stylesBanner from "./QueueDownloadBanner.module.css";

interface Props {
    icon?: React.ReactNode;
    name?: string;
    versionChannel?: string;
    version?: string;
    bannerMode: boolean;
}

const BaseQueue: React.FC<Props> = ({ icon, name, versionChannel, version, bannerMode }: Props) => {
    // Choose the right style
    let styles = stylesNormal;
    if (bannerMode) {
        styles = stylesBanner;
    }

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