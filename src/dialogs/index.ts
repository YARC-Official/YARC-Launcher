import { createStore, useStore } from "zustand";
import { BaseDialog } from "./Dialogs/BaseDialog";

export class DialogManager {
    dialogStore = createStore<BaseDialog | undefined>(() => undefined);
    openStore = createStore<boolean>(() => false);

    createAndShowDialog<T extends BaseDialog>(ctor: new () => T) {
        this.dialogStore.setState(() => new ctor(), true);
        this.openStore.setState(() => true, true);
    }

    closeDialog() {
        this.openStore.setState(() => false, true);
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