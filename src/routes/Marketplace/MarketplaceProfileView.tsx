import { MarketplaceProfile } from "@app/profiles/marketplace";
import styles from "./Marketplace.module.css";
import ProfileIcon from "@app/components/ProfileIcon";
import { localizeObject } from "@app/utils/localized";
import { processAssetUrl } from "@app/profiles/utils";
import { useProfileStore } from "@app/profiles/store";

interface Props {
    profile: MarketplaceProfile,
}

const MarketplaceProfileView: React.FC<Props> = ({ profile }: Props) => {
    const profiles = useProfileStore();

    const localized = localizeObject(profile, "en-US");
    let bannerUrl = localized.bannerUrl;
    if (bannerUrl === undefined) {
        bannerUrl = localized.iconUrl;
    }

    return <button
        className={styles.profileView}
        style={{"--background": `url(${processAssetUrl(bannerUrl)})`} as React.CSSProperties}
        onClick={async () => {
            await profiles.activateProfile(profile.url);
        }}>

        <ProfileIcon iconUrl={localized.iconUrl} className={styles.icon} />
        <div className={styles.info}>
            <header>{localized.name}</header>
            {localized.subText !== undefined &&
                <span>{localized.subText}</span>
            }
        </div>
    </button>;
};

export default MarketplaceProfileView;
