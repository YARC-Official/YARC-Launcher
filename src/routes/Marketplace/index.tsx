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
            <MarketplaceSection name="All Applications">
                {
                    marketIndex.profiles.filter(i => i.type === "application").map(i =>
                        <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                    )
                } 
            </MarketplaceSection>
            <MarketplaceSection name="Official Setlists">
                {
                    marketIndex.profiles.filter(i => i.type === "setlist" && i.category === "official_setlist").map(i =>
                        <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                    )
                }
            </MarketplaceSection>
            <MarketplaceSection name="Yet Another Rhythm Network Setlists">
                {
                    marketIndex.profiles.filter(i => i.type === "setlist" && i.category === "yarn_setlist").map(i =>
                        <MarketplaceProfileView profile={i} setSelectedProfile={setSelectedProfile} key={i.uuid} />
                    )
                }
            </MarketplaceSection>
        </div>
    </main>;
}

export default Marketplace;
