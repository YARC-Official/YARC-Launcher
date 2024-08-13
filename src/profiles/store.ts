import { create } from "zustand";
import { ActiveProfile, Profile } from "./types";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { v4 as createUUID } from "uuid";
import { settingsManager } from "@app/settings";

export interface ProfileStore {
    activeProfiles: ActiveProfile[],

    getProfileByUUID: (uuid: string) => ActiveProfile | undefined,

    activateProfilesFromSettings: () => Promise<void>,
    activateProfile: (profileUrl: string) => Promise<void>,
    removeProfile: (uuid: string) => Promise<void>,
    updateProfile: (activeProfile: ActiveProfile) => Promise<void>,
}

export const useProfileStore = create<ProfileStore>()((set, get) => ({
    activeProfiles: [],

    getProfileByUUID: (uuid) => {
        return get().activeProfiles.find(i => i.uuid === uuid);
    },

    activateProfilesFromSettings: async () => {
        const activeProfiles = settingsManager.getCache("activeProfiles");

        // Attempt to update the profiles
        let errored = false;
        for (const profile of activeProfiles) {
            try {
                const response = await fetch(profile.originalUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch profile! Response status: ${response.status}`);
                }

                // TODO: Schema
                const json = await response.json();
                profile.profile = json;
            } catch (e) {
                console.error(e);
                errored = true;
            }
        }

        set({
            activeProfiles
        });

        if (errored) {
            showErrorDialog("One or more active application/setlist profiles could not be fetched! Do they still exist?");
        }
    },
    activateProfile: async (profileUrl: string) => {
        let profile: Profile;
        try {
            const response = await fetch(profileUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch profile! Response status: ${response.status}`);
            }

            // TODO: Schema
            const json = await response.json();
            profile = json;
        } catch (e) {
            showErrorDialog(e as string);
            return;
        }

        const activeProfile: ActiveProfile = {
            uuid: createUUID(),
            originalUrl: profileUrl,
            displayName: undefined,
            profile: profile,
        };

        // Add to the profile state
        const profiles = get().activeProfiles;
        profiles.push(activeProfile);
        set({
            activeProfiles: profiles
        });

        await settingsManager.set("activeProfiles", profiles);
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
