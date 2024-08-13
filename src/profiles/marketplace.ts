import { Localized } from "@app/utils/localized";

export interface MarketplaceIndex {
    // banner: {
    //     backgroundUrl: string,
    //     subHeaderText: string,
    //     headerText: string,
    //     profileUUID: string
    // },
    lastUpdated: Date,
    profiles: MarketplaceProfile[]
}

export type MarketplaceProfile = Localized<{
    uuid: string,
    type: "application" | "setlist",
    category: string,
    url: string,
    release: Date,

    name: string,
    subText?: string,
    iconUrl: string,
    bannerUrl?: string,
}>;
