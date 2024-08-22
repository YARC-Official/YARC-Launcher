import { SettingsManager } from "tauri-settings";
import { ActiveProfile } from "./profiles/types";

export interface Settings {
    onboardingCompleted: boolean,
    downloadLocation: string,
    lastMarketplaceObserve: string,
    activeProfiles: ActiveProfile[],
}

export const settingsManager = new SettingsManager<Settings>({
    onboardingCompleted: false,
    downloadLocation: "",
    lastMarketplaceObserve: new Date().toISOString(),
    activeProfiles: []
}, {
    prettify: true
});
