import { SettingsManager } from "tauri-settings";

export interface Settings {
    onboardingCompleted: boolean;
    downloadLocation: string;
}

export const settingsManager = new SettingsManager<Settings>({
    onboardingCompleted: false,
    downloadLocation: ""
});
