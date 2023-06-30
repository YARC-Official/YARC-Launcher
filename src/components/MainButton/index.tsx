import styles from "./mainbutton.module.css";
import Installing from "@app/assets/Installing.svg";
import Update from "@app/assets/Update.svg";
import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";

interface Props {
    version: YARGVersion
}

const MainButton: React.FC<Props> = ({ version }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <></>;
    }

    if (!version.payload) {
        if (version.state === YARGStates.NEW_UPDATE) {
            // New update!
            return <div className={styles.update_button} onClick={version.download}>
                <img className={styles.update_icon} src={Update} alt="Update" />
                <div className={styles.update_text}>UPDATE</div>
            </div>;
        } else {
            // Play
            return <div className={styles.play_button} onClick={version.play}>
                <div className={styles.play_text}>PLAY</div>
            </div>;
        }
    } else {
        // Get the display text for download/installing
        let text = "WAITING";
        switch (version.payload.state) {
            case "downloading":
                text = (version.payload.current / version.payload.total * 100).toFixed(0) + "%";
                break;
            case "verifying":
                text = "VERIFIYING";
                break;
            case "installing":
                text = "INSTALLING";
                break;
        }

        return <div className={styles.installing_button}>
            <img className={styles.installing_icon} src={Installing} alt="Installing" />
            <div className={styles.installing_text}>{text}</div>
        </div>;
    }
};

export default MainButton;