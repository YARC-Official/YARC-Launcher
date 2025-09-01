import { localizeObject } from "@app/utils/localized";
import { ActiveProfile, Metadata, Profile } from "./types";
import { path } from "@tauri-apps/api";
import { DirectoriesStore } from "./directories";

export const getPathForProfile = async (store: DirectoriesStore, activeProfile: ActiveProfile) => {
    if (store.customDirs === undefined) {
        throw Error("Custom directories are not initialized!");
    }

    if (activeProfile.profile.type === "setlist") {
        return await path.join(store.customDirs.setlistFolder, activeProfile.uuid);
    } else if (activeProfile.profile.type === "venue") {
        return await path.join(store.customDirs.venueFolder, activeProfile.uuid);
    } else {
        return await path.join(store.customDirs.yargFolder, activeProfile.uuid);
    }
};

export const localizeMetadata = (profile: Profile, locale: string): Metadata => {
    let out: Metadata;

    if (profile.type === "application") {
        out = localizeObject(profile.metadata, locale);
    } else if (profile.type === "setlist") {
        out = localizeObject(profile.metadata, locale);
    } else if (profile.type === "venue") {
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
