import { create } from "zustand";
import { ActiveProfile, AvailableProfile } from "./types";

export interface ProfileStore {
    availableProfiles: AvailableProfile[],
    activeProfiles: ActiveProfile[],

    getProfileByUUID: (uuid: string) => ActiveProfile | undefined,
    setAvailableProfiles: () => Promise<ProfileStore>,
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
    }
}));
