import { useParams } from "react-router-dom";
import { useProfileState } from "@app/hooks/useProfileState";
import styles from "./AppProfile.module.css";
import { VerifiedIcon } from "@app/assets/Icons";

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

    const metadata = profile.metadata.locales["en-US"];

    return <main className={styles.main}>
        <div className={styles.bannerContainer}
            style={{"--bannerBack": `url(${metadata.bannerBackUrl})`} as React.CSSProperties}>

            <div className={styles.bannerApp}>
                <img src={metadata.iconUrl} alt={metadata.name} />
                <div>
                    <div className={styles.verifiedTag}>
                        Official Build <VerifiedIcon />
                    </div>
                    {metadata.name}
                </div>
            </div>
        </div>
    </main>;
}

export default AppProfile;
