import { create } from "zustand";
import { ActiveProfile, AvailableProfile, Profile } from "./types";
import { showErrorDialog } from "@app/dialogs/dialogUtil";
import { v4 as createUUID } from "uuid";
import { settingsManager } from "@app/settings";

export interface ProfileStore {
    availableProfiles: AvailableProfile[],
    activeProfiles: ActiveProfile[],

    getProfileByUUID: (uuid: string) => ActiveProfile | undefined,
    setAvailableProfiles: () => Promise<ProfileStore>,

    activateProfilesFromSettings: () => Promise<void>,
    activateProfile: (profile: AvailableProfile) => Promise<void>,
    removeProfile: (uuid: string) => Promise<void>,
}

export const useProfileStore = create<ProfileStore>()((set, get) => ({
    availableProfiles: [],
    activeProfiles: [],

    getProfileByUUID: (uuid) => {
        return get().activeProfiles.find(i => i.uuid === uuid);
    },
    setAvailableProfiles: async () => {
        set({
            availableProfiles: [
                {
                    "uuid": "2d78800c-1397-496a-83c1-50759607999a",
                    "url": "https://gist.githubusercontent.com/EliteAsian123/1ecaef91dfcf194345b80e1112896411/raw/46242adc1d449f6f718548311f2bbdfff9d5c606/profile.json",
                    "name": "YARG",
                    "iconUrl": "@/icons/Stable.png",

                    "localeOverrides": {}
                }
            ]
        });
        return get();
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
    activateProfile: async (availableProfile: AvailableProfile) => {
        let profile: Profile;
        try {
            const response = await fetch(availableProfile.url);
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
            originalUrl: availableProfile.url,
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
    }
}));
