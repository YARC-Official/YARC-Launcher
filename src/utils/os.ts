import { platform } from "@tauri-apps/plugin-os";

export type OS = "windows" | "macos" | "linux";

export const getOS = async (): Promise<OS> => {
    switch (platform()) {
        case "windows": return "windows";
        case "macos":     return "macos";
        case "linux":      return "linux";
    }
    throw("Unsupported OS");
};
