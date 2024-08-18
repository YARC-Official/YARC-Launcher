import { Localized } from "@app/utils/localized";

export type OnboardingIndex = OnboardingOption[];

export type OnboardingOption =  Localized<{
    uuid: string,
    type: "application" | "setlist",
    url: string,

    name: string,
    subText: string,
    iconUrl: string
}>;
