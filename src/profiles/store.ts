import { create } from "zustand";
import { ActiveProfile, GraphicsApi, Profile, Version, VersionList } from "./types";
import { v4 as createUUID } from "uuid";
import { settingsManager } from "@app/settings";
import { showErrorDialog } from "@app/dialogs";

export interface ProfileStore {
    activeProfiles: ActiveProfile[],

    getProfileByUUID: (uuid: string) => ActiveProfile | undefined,
    anyOfProfileUUID: (uuid: string) => boolean,

    activateProfilesFromSettings: (offline: boolean) => Promise<void>,
    activateProfile: (profileUrl: string) => Promise<string | undefined>,
    removeProfile: (uuid: string) => Promise<void>,
    updateProfile: (activeProfile: ActiveProfile) => Promise<void>,
}

export const useProfileStore = create<ProfileStore>()((set, get) => ({
    activeProfiles: [],

    getProfileByUUID: (uuid) => {
        return get().activeProfiles.find(i => i.uuid === uuid);
    },
    anyOfProfileUUID: (uuid) => {
        return get().activeProfiles.some(i => i.profile.uuid === uuid);
    },

    activateProfilesFromSettings: async (offline: boolean) => {
        const activeProfiles = settingsManager.getCache("activeProfiles");
        let errored = false;

        if (!offline) {
            // Attempt to update the profiles
            for (const profile of activeProfiles) {
                const newProfile = await tryFetchProfile(profile.originalUrl);

                if (newProfile === undefined) {
                    errored = true;
                    continue;
                }

                profile.profile = newProfile;
            }

            // Attempt to update versions
            for (const profile of activeProfiles) {
                const newVersion = await tryFetchVersion(profile.profile, profile.selectedVersion);

                if (newVersion === undefined) {
                    errored = true;
                    continue;
                }

                profile.version = newVersion;
            }
        }

        // Older profile without graphicsAPI setting
        for (const profile of activeProfiles) {
            if (profile.graphicsApi === undefined) {
                profile.graphicsApi = GraphicsApi.Default;
            }
        }

        set({
            activeProfiles
        });

        await settingsManager.set("activeProfiles", activeProfiles);

        if (errored) {
            showErrorDialog("One or more active application/setlist profiles could not be fetched! Do they still exist?");
        }
    },
    activateProfile: async (profileUrl: string) => {
        const profile = await tryFetchProfile(profileUrl);
        if (profile === undefined) {
            return;
        }

        const version = await tryFetchVersion(profile);
        if (version === undefined) {
            return;
        }

        const newUUID = createUUID();
        const activeProfile: ActiveProfile = {
            uuid: newUUID,
            originalUrl: profileUrl,

            displayName: undefined,
            selectedVersion: undefined,
            launchArguments: "",
            useObsVkcapture: false,
            graphicsApi: GraphicsApi.Default,

            lastPlayed: undefined,

            profile: profile,
            version: version,
        };

        // Add to the profile state
        const profiles = get().activeProfiles;
        profiles.push(activeProfile);
        set({
            activeProfiles: profiles
        });

        await settingsManager.set("activeProfiles", profiles);

        return newUUID;
    },
    removeProfile: async (uuid: string) => {
        let profiles = get().activeProfiles;
        profiles = profiles.filter(i => i.uuid !== uuid);
        set({
            activeProfiles: profiles
        });

        await settingsManager.set("activeProfiles", profiles);
    },
    updateProfile: async (activeProfile: ActiveProfile) => {
        const profiles = get().activeProfiles;

        const index = profiles.findIndex(i => i.uuid === activeProfile.uuid);
        profiles[index] = activeProfile;

        set({
            activeProfiles: profiles
        });

        await settingsManager.set("activeProfiles", profiles);
    }
}));

export async function tryFetchProfile(profileUrl: string): Promise<Profile | undefined> {
    try {
        const response = await fetch(profileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile! Response status: ${response.status}`);
        }

        // TODO: Schema
        const json = await response.json();
        return json;
    } catch (e) {
        showErrorDialog(e as string);
        return;
    }
}

export async function tryFetchVersion(profile: Profile, overrideVersion?: string): Promise<Version | undefined> {
    if (profile.version.type === "embedded") {
        return profile.version.version;
    }

    try {
        let versionUrl: string;
        if (profile.version.type === "list") {
            const response = await fetch(profile.version.listUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch version list! Response status: ${response.status}`);
            }

            // TODO: Schema
            const list: VersionList = await response.json();

            if (list.length === 0) {
                throw new Error("Profile has an empty version list!");
            }

            // Pick either the latest version, or attempt to pick from the overridden version
            if (overrideVersion !== undefined) {
                const found = list.find(i => i.uuid === overrideVersion);
                if (found !== undefined) {
                    versionUrl = found.url;
                } else {
                    versionUrl = list[0].url;
                }
            } else {
                versionUrl = list[0].url;
            }
        } else if (profile.version.type === "url") {
            versionUrl = profile.version.releaseUrl;
        } else {
            throw new Error("Unhandled version type!");
        }

        const response = await fetch(versionUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch version! Response status: ${response.status}`);
        }

        // TODO: Schema
        const json = await response.json();
        return json;
    } catch (e) {
        showErrorDialog(e as string);
        return;
    }
}
