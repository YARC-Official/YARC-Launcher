import { SetlistStates } from "@app/hooks/useSetlistData";
import { create } from "zustand";

interface SetlistStateStore {
    states: {
        [key: string]: SetlistStates
    },
    update: (key: string, state: SetlistStates) => void
}

const useSetlistStateStore = create<SetlistStateStore>()((set) => ({
    states: {},
    update(key, state) {
        return set(current => ({
            states: {
                ...current.states,
                [key]: state
            }
        }));
    },
}));

export const useSetlistState = (version: string) => {
    const store = useSetlistStateStore();

    const state = store.states[version];
    const setState = (newState: SetlistStates) => store.update(version, newState);

    return { state, setState };
};