import { MarketplaceIndex } from "@app/profiles/marketplace";
import { useQuery } from "@tanstack/react-query";

const useMarketIndex = (enabled?: boolean) => {
    return useQuery({
        enabled: enabled,
        queryKey: ["MarketIndex"],
        queryFn: async (): Promise<MarketplaceIndex> => await fetch(`${import.meta.env.VITE_RELEASES_SERVER_URL}/profiles/`)
            .then(res => res.json())
    });
};

export default useMarketIndex;
