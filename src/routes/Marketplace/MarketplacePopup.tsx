import { MarketplaceProfile } from "@app/profiles/marketplace";
import { useProfileStore } from "@app/profiles/store";
import styles from "./MarketplacePopup.module.css";
import { AddIcon, CloseIcon, VerifiedIcon } from "@app/assets/Icons";
import { localizeMetadata, processAssetUrl } from "@app/profiles/utils";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@app/profiles/types";
import ProfileIcon from "@app/components/ProfileIcon";
import Button, { ButtonColor } from "@app/components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
    marketplaceProfile?: MarketplaceProfile,
    setSelectedProfile: React.Dispatch<React.SetStateAction<MarketplaceProfile | undefined>>,
}

const MarketplacePopup: React.FC<Props> = ({ marketplaceProfile, setSelectedProfile }: Props) => {
    const profiles = useProfileStore();
    const profileQuery = useQuery({
        enabled: marketplaceProfile !== undefined,
        queryKey: ["Profile", marketplaceProfile?.uuid],
        queryFn: async (): Promise<Profile> => await fetch((marketplaceProfile as MarketplaceProfile).url)
            .then(res => res.json())
    });

    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    if (marketplaceProfile === undefined || profileQuery.isLoading) {
        return <></>;
    }

    const anyOfProfile = profiles.anyOfProfileUUID(marketplaceProfile.uuid);

    const profile = profileQuery.data;
    if (profileQuery.isError || profile === undefined) {
        return <>
            Error: {profileQuery.error}
        </>;
    }

    const metadata = localizeMetadata(profile, "en-US");

    const addToLibrary = async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        const uuid = await profiles.activateProfile(marketplaceProfile.url);
        setSelectedProfile(undefined);

        if (uuid !== undefined) {
            navigate(`/app-profile/${uuid}`);
        }
    };

    let button;
    if (loading) {
        button = <Button color={ButtonColor.DARK} border rounded>
            Loading...
        </Button>;
    } else if (!anyOfProfile) {
        button = <Button color={ButtonColor.GREEN} border rounded onClick={addToLibrary}>
            <AddIcon width={16} height={16} /> Add to Library
        </Button>;
    } else if (anyOfProfile && profile.type === "application") {
        button = <Button color={ButtonColor.BLUE} border rounded onClick={addToLibrary}>
            <AddIcon width={16} height={16} /> Add Another Instance
        </Button>;
    } else if (anyOfProfile && profile.type === "setlist") {
        button = <Button color={ButtonColor.DARK} border rounded>
            Already Added
        </Button>;
    }

    return <div className={styles.popup}>
        <div className={styles.body}>
            <div className={styles.close} onClick={() => setSelectedProfile(undefined)}>
                <CloseIcon />
            </div>

            <div className={styles.bannerContainer}
                style={{"--bannerBack": `url(${processAssetUrl(metadata.bannerBackUrl)})`} as React.CSSProperties}>

                <div className={styles.bannerApp}>
                    <ProfileIcon className={styles.bannerAppIcon} iconUrl={metadata.iconUrl} />
                    <div>
                        <div className={styles.verifiedTag}>
                            Official <VerifiedIcon />
                        </div>
                        {metadata.name}
                    </div>
                </div>
                <div className={styles.bannerOptions}>
                    <div className={styles.bannerOptionsMain}>
                        {button}
                    </div>
                </div>
            </div>

            <div className={styles.description}>
                {metadata.description}
            </div>
        </div>
    </div>;
};

export default MarketplacePopup;