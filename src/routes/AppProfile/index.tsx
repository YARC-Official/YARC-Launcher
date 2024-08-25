import { useParams } from "react-router-dom";
import { useProfileState } from "@app/hooks/useProfileState";
import styles from "./AppProfile.module.css";
import { GithubIcon, InformationIcon, LinkIcon, SettingsIcon, SongIcon, TimeIcon, VerifiedIcon } from "@app/assets/Icons";
import { LaunchButton } from "./LaunchButton";
import { localizeMetadata, processAssetUrl } from "@app/profiles/utils";
import Box from "@app/components/Box";
import { ApplicationMetadata, SetlistMetadata } from "@app/profiles/types";
import Button, { ButtonColor } from "@app/components/Button";
import MoreDropdown from "./MoreDropdown";
import { distanceFromToday, millisToDisplayLength } from "@app/utils/timeFormat";
import ProfileIcon from "@app/components/ProfileIcon";
import NewsSection from "@app/components/NewsSection";
import { askOpenUrl } from "@app/utils/safeUrl";
import AppSettings from "./AppSettings";
import { useEffect, useState } from "react";
import Setlist from "../../components/Setlist";

function AppProfile() {
    const { uuid } = useParams();
    if (!uuid) {
        return <></>;
    }

    const [settingsOpen, setSettingsOption] = useState<boolean>(false);

    // Close settings on tab change
    useEffect(() => {
        setSettingsOption(false);
    }, [uuid]);

    const profileState = useProfileState(uuid);
    if (profileState.loading) {
        return <></>;
    }

    const activeProfile = profileState.activeProfile;
    const profile = activeProfile.profile;

    const metadata = localizeMetadata(profile, "en-US");

    return <main className={styles.main}>
        {settingsOpen &&
            <AppSettings activeProfile={activeProfile} setSettingsOpen={setSettingsOption} />
        }

        <div className={styles.bannerContainer}
            style={{"--bannerBack": `url(${processAssetUrl(metadata.bannerBackUrl)})`} as React.CSSProperties}>

            <div className={styles.bannerApp}>
                <ProfileIcon className={styles.bannerAppIcon} iconUrl={metadata.iconUrl} />
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
                    {profile.type === "setlist" &&
                        <>
                            <div>
                                <SongIcon />
                                <span>
                                    <span className={styles.highlightedStat}>
                                        {(metadata as SetlistMetadata).songs.length}
                                    </span>
                                    &#32; songs
                                </span>
                            </div>
                            <div>
                                <TimeIcon />
                                <span>
                                    <span className={styles.highlightedStat}>
                                        {millisToDisplayLength(
                                            (metadata as SetlistMetadata).songs.reduce((a, i) => a + i.length, 0),
                                            true)}
                                    </span>
                                    &#32; long
                                </span>
                            </div>
                        </>
                    }
                </div>
                <div className={styles.bannerOptionsMain}>
                    {profile.type === "application" &&
                        <Button color={ButtonColor.DARK} rounded border
                            style={{padding: "15px"}} onClick={() => setSettingsOption(true)}>

                            <SettingsIcon width={24} height={24} />
                        </Button>
                    }

                    <LaunchButton profileState={profileState} />
                    <MoreDropdown profileState={profileState} />
                </div>
            </div>
        </div>
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                {profile.type === "setlist" &&
                    <Setlist profile={profile} />
                }

                <NewsSection categoryFilter={metadata.newsCategory} startingEntries={4}/>
            </div>
            <div className={styles.sidebar}>
                <Box>
                    <header>
                        <InformationIcon />
                        {profile.type === "application"
                            ? `About ${metadata.name} (${(metadata as ApplicationMetadata).releaseName})`
                            : `About ${metadata.name}`}
                    </header>
                    {metadata.description}
                </Box>
                {
                    Object.entries(metadata.links).map(i => {
                        let icon = <LinkIcon width={12} height={12} />;
                        if (i[1].url.startsWith("https://github.com")) {
                            icon = <GithubIcon width={24} height={24} />;
                        }

                        return <Button color={ButtonColor.LIGHT} key={i[0]}
                            onClick={async () => await askOpenUrl(i[1].url)}>

                            <div className={styles.icon}>
                                {icon}
                            </div>
                            {i[1].name}
                        </Button>;
                    })
                }
            </div>
        </div>
    </main>;
}

export default AppProfile;
