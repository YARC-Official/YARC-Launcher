import styles from "./mainbutton.module.css";
import Installing from "@app/assets/Installing.svg";
import Update from "@app/assets/Update.svg";
import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";

interface Props {
    version: YARGVersion,
    playName: string,
}

const MainButton: React.FC<Props> = ({ version, playName }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <></>;
    }

    if (!version.payload) {
        if (version.state === YARGStates.NEW_UPDATE) {
            // New update!
            return <button className={[styles.button, styles.update_button].join(" ")} onClick={version.download}>
                <img className={styles.update_icon} src={Update} alt="Update" />
                <div className={[styles.text, styles.update_text].join(" ")}>UPDATE {playName}</div>
            </button>;
        } else {
            // Play
            return <button className={[styles.button, styles.play_button].join(" ")} onClick={version.play}>
                <div className={[styles.text, styles.play_text].join(" ")}>PLAY {playName}</div>
            </button>;
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

        return <button className={[styles.button, styles.installing_button].join(" ")}>
            <img className={styles.installing_icon} src={Installing} alt="Installing" />
            <div className={[styles.text, styles.installing_text].join(" ")}>{text}</div>
        </button>;
    }
};

export default MainButton;