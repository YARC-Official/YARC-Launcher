import { MarketplaceIndex } from "@app/profiles/marketplace";
import { useQuery } from "@tanstack/react-query";

const useMarketIndex = (enabled?: boolean) => {
    return useQuery({
        enabled: enabled,
        queryKey: ["MarketIndex"],
        queryFn: async (): Promise<MarketplaceIndex> => await fetch("https://releases.yarg.in/profiles/")
            .then(res => res.json())
    });
};

export default useMarketIndex;
