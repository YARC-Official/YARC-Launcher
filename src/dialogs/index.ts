import { createStore, useStore } from "zustand";
import waitUntil, { WAIT_FOREVER } from "async-wait-until";
import { Component } from "react";

export class DialogManager {
    private dialogStore = createStore<typeof Component | undefined>(() => undefined);
    private openStore = createStore<boolean>(() => false);

    dialogOut?: string;

    async createAndShowDialog(dialog: typeof Component): Promise<string | undefined> {
        console.log("Showing dialog!");

        // If there's already a dialog open, close the current one
        if (this.openStore.getState()) {
            return undefined;
        }

        // Open the dialog
        this.dialogStore.setState(() => dialog, true);
        this.openStore.setState(() => true, true);

        // Subscribe to the close event
        let done = false;
        const unsubscribe = this.openStore.subscribe(newState => {
            if (!newState) {
                done = true;
            }
        });

        // Wait until close
        await waitUntil(() => done, {
            timeout: WAIT_FOREVER
        });
        unsubscribe();
        return this.dialogOut;
    }

    closeDialog(dialogOut?: string) {
        this.openStore.setState(() => false, true);
        this.dialogOut = dialogOut;
    }

    useDialog() {
        return useStore(this.dialogStore);
    }

    useOpen() {
        return useStore(this.openStore);
    }

    setOpen(value: boolean) {
        this.openStore.setState(() => value, true);
    }
}