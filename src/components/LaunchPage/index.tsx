import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";
import styles from "./styles.module.css";
import { GenericBox, GenericBoxHeader } from "../GenericBox";
import Button, { ButtonColor } from "../Button";
import { DateIcon, InformationIcon, InstallingIcon, LinkIcon, UpdateIcon } from "@app/assets/Icons";
import PayloadProgress from "../PayloadProgress";
import { calculatePayloadPercentage } from "@app/utils/Download/payload";
import { useDialogManager } from "@app/dialogs/DialogProvider";
import TooltipWrapper from "../TooltipWrapper";
import { intlFormatDistance } from "date-fns";
import NewsSection from "../NewsSection";

const INITIAL_RELEASE_DATE = new Date("2023-03-09T05:00:00.000Z");

interface Props {
    version: YARGVersion,
    releaseTag: string,
    playName: string,
    description: React.ReactNode,
    websiteUrl: string,
    icon: string,
}

interface LaunchButtonProps extends React.PropsWithChildren {
    style?: React.CSSProperties
}

const LaunchPage: React.FC<Props> = ({ version, releaseTag, playName, description, websiteUrl, icon }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <p>Error: No version.</p>;
    }

    const dialogManager = useDialogManager();

    function LaunchButton(props: LaunchButtonProps) {
        if (version.state === YARGStates.NEW_UPDATE) {
            return <Button style={props.style} color={ButtonColor.GREEN} onClick={() => version.download(dialogManager)}>
                <UpdateIcon /> Update {playName}
            </Button>;
        } else if (version.state === YARGStates.DOWNLOADING) {
            if (!version.payload) {
                return <></>;
            }

            return <Button style={props.style} progress={calculatePayloadPercentage(version.payload)} color={ButtonColor.YELLOW}>
                <InstallingIcon />
                <PayloadProgress payload={version.payload} />
            </Button>;
        } else {
            return <Button style={props.style} color={ButtonColor.BLUE} onClick={() => version.play(dialogManager)}>
                Play {playName}
            </Button>;
        }
    }

    return <>
        <div className={styles.header}>
            <div className={styles.icon_container}>
                <img className={styles.icon} src={icon} alt="YARG" />
                <div className={styles.game_info}>
                    YARG
                    <div className={styles.version_badge}>
                        {releaseTag}
                    </div>
                </div>
            </div>
            <div className={styles.actions} />
        </div>
        <div className={styles.main}>
            <NewsSection categoryFilter="yarg" />
            <div className={styles.sidebar}>
                <LaunchButton style={{ width: "100%" }} />
                <GenericBox>
                    <GenericBoxHeader>
                        <InformationIcon />
                        YARG {playName}
                    </GenericBoxHeader>

                    {description}

                    <div className={styles.info_list}>
                        <TooltipWrapper
                            text={`Initial Release Date (${intlFormatDistance(INITIAL_RELEASE_DATE, new Date())})`}
                            className={styles.info_entry}>

                            <DateIcon />
                            {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(INITIAL_RELEASE_DATE)}
                        </TooltipWrapper>
                        <a className={styles.info_entry} href={websiteUrl} target="_blank" rel="noreferrer">
                            <LinkIcon />
                            Official Website
                        </a>
                    </div>
                </GenericBox>
            </div>
        </div>
    </>;
};

export default LaunchPage;