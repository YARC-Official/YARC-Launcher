import { SettingsManager } from "tauri-settings";

export interface Settings {
    downloadLocation: string;
}

export const settingsManager = new SettingsManager<Settings>({
    downloadLocation: ""
});
