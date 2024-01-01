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

interface useSetlistStateInterface {
    state: SetlistStates;
    setState: (newState: SetlistStates) => void;
}

export const useSetlistState = (version?: string): useSetlistStateInterface => {
    const store = useSetlistStateStore();

    // If we don't have a version yet, return a dummy loading version;
    if (!version) {
        return {
            state: SetlistStates.LOADING,
            setState: () => {}
        };
    }

    const state = store.states[version];
    const setState = (newState: SetlistStates) => store.update(version, newState);

    return { state, setState };
};