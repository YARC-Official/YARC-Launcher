import { createContext } from "react";
import { useContext } from "react";
import { DialogManager } from ".";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./DialogProvider.module.css";

const DialogManagerContext = createContext<DialogManager>({} as DialogManager);

function DialogContextInner() {
    const dialogManager = useDialogManager();

    function prevent(e: Event) {
        e.preventDefault();
    }

    return <Dialog.Root open={dialogManager.useOpen()} onOpenChange={v => dialogManager.setOpen(v)}>
        <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={styles.content} onPointerDownOutside={prevent} onInteractOutside={prevent}>
                {dialogManager.useDialog()?.render(dialogManager)}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}

export const DialogManagerProvider: React.FC<React.PropsWithChildren> = ({ children }: React.PropsWithChildren) => {
    return <DialogManagerContext.Provider value={new DialogManager()}>
        {children}

        <DialogContextInner />
    </DialogManagerContext.Provider>;
};

export const useDialogManager = () => useContext(DialogManagerContext);