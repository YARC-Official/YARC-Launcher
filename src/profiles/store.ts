import { create } from "zustand";
import { AvailableProfile, Profile } from "./types";

export interface ProfileStore {
    availableProfiles: AvailableProfile[],
    profiles: Profile[],

    getProfileByUUID: (uuid: string) => Profile | undefined,
    setAvailableProfiles: () => Promise<ProfileStore>,
}

export const useProfileStore = create<ProfileStore>()((set, get) => ({
    availableProfiles: [],
    profiles: [],

    getProfileByUUID: (uuid) => {
        return get().profiles.find(i => i.uuid === uuid);
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
    }
}));
