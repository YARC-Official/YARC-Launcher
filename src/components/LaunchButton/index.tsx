import styles from "./LaunchButton.module.css";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";
import Button, { ButtonColor } from "../Button";
import PayloadProgress from "../PayloadProgress";
import { calculatePayloadPercentage } from "@app/utils/Download/payload";
import { useDialogManager } from "@app/dialogs/DialogProvider";

interface Props {
    version: YARGVersion,
    playName: string,
}

const LaunchButton: React.FC<Props> = ({ version, playName }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <></>;
    }

    // Get dialog manager
    const dialogManager = useDialogManager();

    if (version.state === YARGStates.NEW_UPDATE) {
        // New update!
        return <Button width={200} height={48} color={ButtonColor.GREEN} onClick={() => version.download(dialogManager)}>
            <UpdateIcon />
            <span className={styles.text}>UPDATE {playName}</span>
        </Button>;
    } else if (version.state === YARGStates.DOWNLOADING) {
        if (!version.payload) {
            return <></>;
        }

        return <Button width={200} height={48} progress={calculatePayloadPercentage(version.payload)} color={ButtonColor.YELLOW}>
            <InstallingIcon />
            <span className={styles.text}>
                <PayloadProgress payload={version.payload} />
            </span>
        </Button>;
    } else {
        // Play
        return <Button width={200} height={48} color={ButtonColor.BLUE} onClick={() => version.play(dialogManager)}>
            <span className={styles.text}>PLAY {playName}</span>
        </Button>;
    }
};

export default LaunchButton;