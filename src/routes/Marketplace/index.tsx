import styles from "./Marketplace.module.css";
import { MarketplaceIndex } from "@app/profiles/marketplace";
import MarketplaceSection from "./MarketplaceSection";
import MarketplaceProfileView from "./MarketplaceProfileView";
import { useQuery } from "@tanstack/react-query";

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

    return <main className={styles.main}>
        <div className={styles.search}>

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
