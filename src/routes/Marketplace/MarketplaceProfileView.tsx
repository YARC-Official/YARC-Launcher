import { MarketplaceProfile } from "@app/profiles/marketplace";
import styles from "./Marketplace.module.css";
import ProfileIcon from "@app/components/ProfileIcon";
import { localizeObject } from "@app/utils/localized";
import { processAssetUrl } from "@app/profiles/utils";
import { useProfileStore } from "@app/profiles/store";
import {CheckmarkIcon} from "@app/assets/Icons";

interface Props {
    profile: MarketplaceProfile,
    setSelectedProfile: React.Dispatch<React.SetStateAction<MarketplaceProfile | undefined>>,
}

const MarketplaceProfileView: React.FC<Props> = ({ profile, setSelectedProfile }: Props) => {
    const profiles = useProfileStore();
    const isInstalled = profiles.anyOfProfileUUID(profile.uuid);
    const localized = localizeObject(profile, "en-US");

    let bannerUrl = localized.bannerUrl;
    if (bannerUrl === undefined) {
        bannerUrl = localized.iconUrl;
    }

    return <button
        className={styles.profileView}
        style={{"--background": `url(${processAssetUrl(bannerUrl)})`} as React.CSSProperties}
        onClick={() => setSelectedProfile(profile)}>

        <ProfileIcon iconUrl={localized.iconUrl} className={styles.icon} />
        <div className={styles.info}>
            <header>{localized.name}</header>
            {localized.subText !== undefined && <span>{localized.subText}</span>}
        </div>

        {isInstalled && (
            <span className={styles.installedLabel}>
                <CheckmarkIcon className={styles.checkmarkIcon} />
            </span>
        )}
    </button>;
};

export default MarketplaceProfileView;
