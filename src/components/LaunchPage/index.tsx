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
import { ReactNode } from "react";

const INITIAL_RELEASE_DATE = new Date("2023-03-09T05:00:00.000Z");

interface Props {
    version: YARGVersion,
    playName: string,
    description: ReactNode,
    websiteUrl: string,
}

interface LaunchButtonProps extends React.PropsWithChildren {
    style?: React.CSSProperties
}

const LaunchPage: React.FC<Props> = ({ version, playName, description, websiteUrl }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <p>Error: No version.</p>;
    }

    const dialogManager = useDialogManager();

    function LaunchButton(props: LaunchButtonProps) {
        if (version.state === YARGStates.AVAILABLE) {
            return <Button style={props.style} color={ButtonColor.BLUE}>
                Play {playName}
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
            return <Button style={props.style} color={ButtonColor.GREEN} onClick={() => version.download(dialogManager)}>
                <UpdateIcon /> Update {playName}
            </Button>;
        }
    }

    return <>
        <div className={styles.banner} />
        <div className={styles.main}>
            <div className={styles.content}>
                Don&apos;t eat the YARG gems...
            </div>
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