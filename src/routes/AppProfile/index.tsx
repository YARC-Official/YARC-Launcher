import { useParams } from "react-router-dom";
import { useProfileState } from "@app/hooks/useProfileState";
import styles from "./AppProfile.module.css";
import { InformationIcon, TimeIcon, VerifiedIcon } from "@app/assets/Icons";
import { LaunchButton } from "./LaunchButton";
import { localizeMetadata, processAssetUrl } from "@app/profiles/utils";
import Box from "@app/components/Box";
import { ApplicationMetadata } from "@app/profiles/types";
import Button, { ButtonColor } from "@app/components/Button";
import MoreDropdown from "./MoreDropdown";
import intlFormatDistance from "date-fns/intlFormatDistance";
import { distanceFromToday } from "@app/utils/timeFormat";

function AppProfile() {
    const { uuid } = useParams();
    if (!uuid) {
        return <></>;
    }

    const profileState = useProfileState(uuid);
    if (profileState.loading) {
        return <></>;
    }

    const activeProfile = profileState.activeProfile;
    const profile = activeProfile.profile;

    const metadata = localizeMetadata(profile, "en-US");

    return <main className={styles.main}>
        <div className={styles.bannerContainer}
            style={{"--bannerBack": `url(${processAssetUrl(metadata.bannerBackUrl)})`} as React.CSSProperties}>

            <div className={styles.bannerApp}>
                <img src={processAssetUrl(metadata.iconUrl)} alt={metadata.name} />
                <div>
                    <div className={styles.verifiedTag}>
                        Official <VerifiedIcon />
                    </div>
                    {activeProfile.displayName !== undefined ? activeProfile.displayName : metadata.name}
                </div>
            </div>
            <div className={styles.bannerOptions}>
                <div className={styles.bannerOptionsStats}>
                    {profile.type === "application" &&
                        <div>
                            <TimeIcon />
                            <span>
                                Last played
                                &#32;<span className={styles.highlightedStat}>
                                    {(activeProfile.lastPlayed === undefined || activeProfile.lastPlayed === null)
                                        ? "never"
                                        : distanceFromToday(activeProfile.lastPlayed)}
                                </span>
                            </span>
                        </div>
                    }
                </div>
                <div className={styles.bannerOptionsMain}>
                    <LaunchButton profileState={profileState} />
                    <MoreDropdown profileState={profileState} />
                </div>
            </div>
        </div>
        <div className={styles.pageContainer}>
            <div className={styles.content}>

            </div>
            <div className={styles.sidebar}>
                <Box className={styles.sidebarBox}>
                    <header>
                        <InformationIcon />
                        {profile.type === "application"
                            ? `About ${metadata.name} (${(metadata as ApplicationMetadata).releaseName})`
                            : `About ${metadata.name}`}
                    </header>
                    {metadata.description}
                </Box>
                {
                    Object.entries(metadata.links).map(i =>
                        <Button color={ButtonColor.LIGHT} key={i[0]}>
                            {i[1].name}
                        </Button>
                    )
                }
            </div>
        </div>
    </main>;
}

export default AppProfile;
