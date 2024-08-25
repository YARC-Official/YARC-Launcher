import { Localized } from "@app/utils/localized";

export interface MarketplaceIndex {
    banner: Localized<{
        backgroundUrl: string,
        backgroundAccent?: string,
        preHeaderText?: string,
        headerText: string,

        viewProfileUUID: string,
        previewUrl?: string,
    }>,
    lastUpdated: string,
    profiles: MarketplaceProfile[]
}

export type MarketplaceProfile = Localized<{
    uuid: string,
    type: "application" | "setlist",
    category: string,
    url: string,
    release: string,

    name: string,
    subText?: string,
    iconUrl: string,
    bannerUrl?: string,
}>;
