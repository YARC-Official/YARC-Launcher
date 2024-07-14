import { type } from "@tauri-apps/api/os";

export type OS = "windows" | "macos" | "linux";

export const getOS = async (): Promise<OS> => {
    switch (await type()) {
        case "Windows_NT": return "windows";
        case "Darwin":     return "macos";
        case "Linux":      return "linux";
    }
};
