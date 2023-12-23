import { createContext } from "react";
import { DownloadClient } from ".";
import { useContext } from "react";
import { useDialogManager } from "@app/dialogs/DialogProvider";

const DownloadClientContext = createContext<DownloadClient>({} as DownloadClient);

type ProviderProps = {
    children?: React.ReactNode;
}

export const DownloadClientProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
    const dialogManager = useDialogManager();

    return <DownloadClientContext.Provider value={new DownloadClient(dialogManager)}>
        {children}
    </DownloadClientContext.Provider>;
};

export const useDownloadClient = () => useContext(DownloadClientContext);