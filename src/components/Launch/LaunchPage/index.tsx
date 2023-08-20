import { YARGVersion } from "@app/hooks/useYARGVersion";
import styles from "./styles.module.css";
import { GenericBox, GenericBoxHeader } from "../../GenericBox";
import { DateIcon, InformationIcon, LinkIcon } from "@app/assets/Icons";
import TooltipWrapper from "../../TooltipWrapper";
import { intlFormatDistance } from "date-fns";
import NewsSection from "../../NewsSection";
import { LaunchButton } from "../LaunchButton";

const INITIAL_RELEASE_DATE = new Date("2023-03-09T05:00:00.000Z");

interface Props {
    version: YARGVersion,
    releaseTag: string,
    playName: string,
    description: React.ReactNode,
    websiteUrl: string,
    icon: string,
    banner: string,
}

const LaunchPage: React.FC<Props> = ({ version, releaseTag, playName, description, websiteUrl, icon, banner }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <p>Error: No version.</p>;
    }

    return <>
        <div className={styles.header} style={{backgroundImage: `url("${banner}")`}}>
            <div className={styles.icon_container}>
                <img className={styles.icon} src={icon} alt="YARG" />
                <div className={styles.game_info}>
                    <span className={styles.game_name}>
                        YARG
                    </span>
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
                <LaunchButton style={{ width: "100%" }} version={version} playName={playName} />
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