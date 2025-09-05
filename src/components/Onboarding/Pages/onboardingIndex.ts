import { Localized } from "@app/utils/localized";

export type OnboardingIndex = OnboardingOption[];

export type OnboardingOption =  Localized<{
    uuid: string,
    type: "application" | "setlist" | "venue",
    url: string,

    name: string,
    subText: string,
    iconUrl: string,

    selectedByDefault: boolean,
}>;
