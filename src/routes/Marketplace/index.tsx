import styles from "./Marketplace.module.css";
import MarketplaceSection from "./MarketplaceSection";
import MarketplaceProfileView from "./MarketplaceProfileView";
import { processAssetUrl } from "@app/profiles/utils";
import { localizeObject } from "@app/utils/localized";
import Button, { ButtonColor } from "@app/components/Button";
import { MarketplaceProfile } from "@app/profiles/marketplace";
import { askOpenUrl } from "@app/utils/safeUrl";
import MarketplacePopup from "./MarketplacePopup";
import { useEffect, useState } from "react";
import { showErrorDialog } from "@app/dialogs";
import useMarketIndex from "@app/hooks/useMarketIndex";
import { settingsManager } from "@app/settings";

function Marketplace() {
    const [selectedProfile, setSelectedProfile] = useState<MarketplaceProfile | undefined>(undefined);
    const marketIndexQuery = useMarketIndex();

    // Used for the "Updated!" tag
    useEffect(() => {
        (async () => {
            await settingsManager.set("lastMarketplaceObserve", new Date().toISOString());
        })();
    }, []);

    if (marketIndexQuery.isLoading) {
        return <>Loading...</>;
    }

    const marketIndex = marketIndexQuery.data;
    if (marketIndexQuery.isError || marketIndex === undefined) {
        return <>
            Error: {marketIndexQuery.error}
        </>;
    }

    const banner = localizeObject(marketIndex.banner, "en-US");

    const bannerStyles = [ styles.banner ];
    if (banner.useLightText) {
        bannerStyles.push(styles.lightBannerText);
    }

    // We could use reduce to do this all in one pass, but this is easier to read and the performance difference is irrelevant
    const applications = marketIndex.profiles.filter(i => i.type === "application");
    const setlists = marketIndex.profiles.filter(i => i.type === "setlist" && i.category === "official_setlist");
    const yarnSetlists = marketIndex.profiles.filter(i => i.type === "setlist" && i.category === "yarn_setlist");
    const venues = marketIndex.profiles.filter(i => i.type === "venue");
    const hasNoContent = applications.length === 0 && setlists.length === 0 && yarnSetlists.length === 0 && venues.length === 0;

    return <main className={styles.main}>
        <MarketplacePopup marketplaceProfile={selectedProfile} setSelectedProfile={setSelectedProfile} />

        <div className={bannerStyles.join(" ")}
            style={{
                "--banner": `url(${processAssetUrl(banner.backgroundUrl)})`,
                "--accent": banner.backgroundAccent === undefined ? "transparent" : banner.backgroundAccent
            } as React.CSSProperties}>

            <div className={styles.newTag}>
                New!
            </div>
            {banner.preHeaderText !== undefined &&
                <div className={styles.preHeader}>
                    {banner.preHeaderText}
                </div>
            }
            <div className={styles.header}>
                {banner.headerText}
            </div>
            <div className={styles.buttons}>
                <Button color={ButtonColor.GREEN} rounded border onClick={() => {
                    const profile = marketIndex.profiles.find(i => i.uuid === banner.viewProfileUUID);

                    if (profile === undefined) {
                        showErrorDialog("The banner does not have a valid marketplace profile attached to it!");
                        return;
                    }

                    setSelectedProfile(profile);
                }}>
                    Get
                </Button>

                {banner.previewUrl !== undefined &&
                    <Button color={banner.useLightText ? ButtonColor.BLUE : ButtonColor.DARK} rounded border
                        onClick={async () => await askOpenUrl(banner.previewUrl as string)}>

                        Preview
                    </Button>
                }
            </div>
        </div>

        <div className={styles.content}>
            {applications.length > 0 &&
                <MarketplaceSection name="All Applications">
                    {
                        applications.map(i =>
                            <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                        )
                    }
                </MarketplaceSection>
            }
            { setlists.length > 0 &&
                <MarketplaceSection name="Official Setlists">
                    {
                        setlists.map(i =>
                            <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                        )
                    }
                </MarketplaceSection>
            }
            { yarnSetlists.length > 0 &&
                <MarketplaceSection name="Yet Another Rhythm Network Setlists">
                    {
                        yarnSetlists.map(i =>
                            <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                        )
                    }
                </MarketplaceSection>
            }
            { venues.length > 0 &&
                <MarketplaceSection name="Venues">
                    {
                        venues.map(i =>
                            <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                        )
                    }
                </MarketplaceSection>
            }
            { hasNoContent &&
                <div className={styles.content}>
                    <h2>Marketplace is Empty</h2>
                    <p>There are currently no items in the marketplace. Please check back later.</p>
                </div>
            }
        </div>
    </main>;
}

export default Marketplace;