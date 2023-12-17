import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            gcTime: Infinity
        },
    },
});

const localStoragePersister = createSyncStoragePersister({ storage: window.localStorage });

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
});
