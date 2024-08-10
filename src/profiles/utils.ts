import { localizeObject } from "@app/utils/localized";
import { Metadata, Profile, Version } from "./types";
import { path } from "@tauri-apps/api";
import { DirectoriesStore } from "./directories";

export const getPathForProfile = async (store: DirectoriesStore, profile: Profile) => {
    if (store.customDirs === undefined) {
        throw Error("Custom directories are not initialized!");
    }

    if (profile.type === "setlist") {
        return await path.join(store.customDirs.setlistFolder, profile.uuid);
    } else {
        return await path.join(store.customDirs.yargFolder, profile.uuid);
    }
};

export const getProfileVersion = (profile: Profile): Version => {
    if (profile.version.type === "embedded") {
        return profile.version.version;
    }

    throw new Error("Not implemented");
};

export const localizeMetadata = (profile: Profile, locale: string): Metadata => {
    let out: Metadata;

    if (profile.type === "application") {
        out = localizeObject(profile.metadata, locale);
    } else if (profile.type === "setlist") {
        out = localizeObject(profile.metadata, locale);
    } else {
        throw new Error("Unhandled profile type!");
    }

    return out;
};

export const processAssetUrl = (url: string): string => {
    if (url.startsWith("@/")) {
        return url.replace("@/", "/profileAssets/");
    }
    return url;
};
