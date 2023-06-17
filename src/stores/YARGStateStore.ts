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

export const useYARGState = (version: string) => {
    const store = useYARGStateStore();

    const state = store.states[version];
    const setState = (newState: YARGStates) => store.update(version, newState);

    return { state, setState };
};