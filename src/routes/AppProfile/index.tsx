import { useParams } from "react-router-dom";
import { useProfileState } from "@app/hooks/useProfileState";
import styles from "./AppProfile.module.css";
import { VerifiedIcon } from "@app/assets/Icons";
import { LaunchButton } from "./LaunchButton";
import { localizeMetadata, processAssetUrl } from "@app/profiles/utils";

function AppProfile() {
    const { uuid } = useParams();
    if (!uuid) {
        return <></>;
    }

    const profileState = useProfileState(uuid);
    const profile = profileState.profile;
    if (profileState.loading) {
        return <></>;
    }

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
                    {metadata.name}
                </div>
            </div>
            <div className={styles.bannerOptions}>
                <div className={styles.bannerOptionsStats}>
                    {/* <div>
                        Last played 3 days ago
                    </div>
                    <div>
                        400 hours played
                    </div> */}
                </div>
                <div className={styles.bannerOptionsMain}>
                    <LaunchButton profileState={profileState} />
                </div>
            </div>
        </div>
    </main>;
}

export default AppProfile;
