import { Component } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

type DialogStore = {
    open: boolean,
    props?: Record<string, unknown>,
    content?: typeof Component,
    output?: string
}

const store = createStore<DialogStore>(
    () => ({open: false})
);

export const createAndShowDialog = async (content: typeof Component, props?: Record<string, unknown>): Promise<string|undefined> => {    
    const current = store.getState();
    if(current.open) return;

    store.setState({
        content,
        props,
        open: true,
    });

    return new Promise<string|undefined>((resolve) => {
        const unsubscribe = store.subscribe(({open, output}) => {
            if(open) return;

            unsubscribe();
            resolve(output);
        });
    });
};

export const closeDialog = (output?: string) => {
    store.setState({
        open: false,
        output
    });
};

export const useDialog = () => {
    return useStore(store);
};

export const setDialogOpen = (open: boolean) => {
    store.setState({
        open
    });
};