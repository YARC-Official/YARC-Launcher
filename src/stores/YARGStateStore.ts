import { YARGStates } from "@app/hooks/useYARGVersion";
import { create } from "zustand";

interface YARGStateStore {
    states: {
        [key: string]: YARGStates
    },
    update: (key: string, state: YARGStates) => void
}

const useYARGStateStore = create<YARGStateStore>()((set) => ({
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

interface useYARGStateInterface {
    state: YARGStates;
    setState: (newState: YARGStates) => void;
}

export const useYARGState = (version?: string): useYARGStateInterface => {
    const store = useYARGStateStore();

    // If we don't have a version yet, return a dummy loading version;
    if (!version) {
        return {
            state: YARGStates.LOADING,
            setState: () => {}
        };
    }

    const state = store.states[version];
    const setState = (newState: YARGStates) => store.update(version, newState);

    return { state, setState };
};