import { createContext } from "react";
import { DownloadClient } from ".";
import { useContext } from "react";

const DownloadClientContext = createContext<DownloadClient>({} as DownloadClient);

type ProviderProps = {
    children?: React.ReactNode;
}

export const DownloadClientProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
    return <DownloadClientContext.Provider value={new DownloadClient()}>
        {children}
    </DownloadClientContext.Provider>;
};

export const useDownloadClient = () => useContext(DownloadClientContext);