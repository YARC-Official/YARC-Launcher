import styles from "./Marketplace.module.css";
import { MarketplaceIndex } from "@app/profiles/marketplace";
import MarketplaceSection from "./MarketplaceSection";
import MarketplaceProfileView from "./MarketplaceProfileView";
import { useQuery } from "@tanstack/react-query";
import { processAssetUrl } from "@app/profiles/utils";
import { localizeObject } from "@app/utils/localized";
import Button, { ButtonColor } from "@app/components/Button";
import { LinkIcon } from "@app/assets/Icons";
import { askOpenUrl } from "@app/utils/safeUrl";

function Marketplace() {
    const marketIndexQuery = useQuery({
        queryKey: ["MarketIndex"],
        queryFn: async (): Promise<MarketplaceIndex> => await fetch("https://releases.yarg.in/profiles/")
            .then(res => res.json())
    });

    const marketIndex = marketIndexQuery.data;
    if (marketIndexQuery.isError || marketIndex === undefined) {
        return <>
            Error: {marketIndexQuery.error}
        </>;
    }

    const banner = localizeObject(marketIndex.banner, "en-US");

    return <main className={styles.main}>
        <div className={styles.banner}
            style={{
                "--banner": `url(${processAssetUrl(banner.backgroundUrl)})`,
                "--accent": banner.backgroundAccent === undefined ? "transparent" : banner.backgroundAccent
            } as React.CSSProperties}>

            <div className={styles.preHeader}>
                {banner.preHeaderText}
            </div>
            <div className={styles.header}>
                {banner.headerText}
            </div>
            <div className={styles.buttons}>
                <Button color={ButtonColor.GREEN} rounded border>
                    View
                </Button>

                {banner.previewUrl !== undefined &&
                    <Button color={ButtonColor.DARK} rounded border
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
                        <MarketplaceProfileView profile={i} key={i.uuid} />
                    )
                }
            </MarketplaceSection>
            <MarketplaceSection name="All Setlists">
                {
                    marketIndex.profiles.filter(i => i.type === "setlist").map(i =>
                        <MarketplaceProfileView profile={i} key={i.uuid} />
                    )
                }
            </MarketplaceSection>
        </div>
    </main>;
}

export default Marketplace;
