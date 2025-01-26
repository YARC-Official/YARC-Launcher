import { platform } from "@tauri-apps/plugin-os";

export type OS = "windows" | "macos" | "linux";

export const getOS = platform;
