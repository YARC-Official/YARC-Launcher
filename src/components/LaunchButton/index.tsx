import styles from "./LaunchButton.module.css";
import { ReactComponent as InstallingIcon } from "@app/assets/Installing.svg";
import { ReactComponent as UpdateIcon } from "@app/assets/Update.svg";
import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";
import Button, { ButtonColor } from "../Button";
import PayloadProgress from "../PayloadProgress";

interface Props {
    version: YARGVersion,
    playName: string,
}

const LaunchButton: React.FC<Props> = ({ version, playName }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <></>;
    }

    if (version.state === YARGStates.NEW_UPDATE) {
        // New update!
        return <Button width={200} height={48} color={ButtonColor.GREEN} onClick={version.download}>
            <UpdateIcon />
            <span className={styles.text}>UPDATE {playName}</span>
        </Button>;
    } else if (version.state === YARGStates.DOWNLOADING) {
        if (!version.payload) {
            return <></>;
        }

        return <Button width={200} height={48} color={ButtonColor.YELLOW}>
            <InstallingIcon />
            <span className={styles.text}>
                <PayloadProgress payload={version.payload} />
            </span>
        </Button>;
    } else {
        // Play
        return <Button width={200} height={48} color={ButtonColor.BLUE} onClick={version.play}>
            <span className={styles.text}>PLAY {playName}</span>
        </Button>;
    }
};

export default LaunchButton;