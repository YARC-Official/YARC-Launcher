import { useQuery, useQueries } from "@tanstack/react-query";
import { NightlyRelease, NightlyReleaseIndexEntry } from "@app/profiles/types";

export interface NightlyReleases {
    indexEntries: NightlyReleaseIndexEntry[]
}

export const useNightlyReleases = () => {
    const releaseIndex = useQuery({
        queryKey: ["NightlyReleaseIndex"],
        queryFn: async (): Promise<NightlyReleases> => {
            const data = await fetch(
                `${import.meta.env.VITE_RELEASES_SERVER_URL}/NightlyYARG/releases.json`)
                .then(res => res.json());

            return { indexEntries: data };
        }
    });

    return useQueries({
        queries: (releaseIndex.data?.indexEntries ?? []).map(entry => ({
            queryKey: ["NightlyRelease", entry.tagName],
            queryFn: async (): Promise<NightlyRelease> => {
                const res = await fetch(
                    `${import.meta.env.VITE_RELEASES_SERVER_URL}/changelogs/NightlyYARG/${entry.tagName}`
                );
                const data = await res.json();

                return {
                    ...data,
                    tagName: entry.tagName,
                    publishedAt: new Date(entry.publishedAt)
                };
            }
        }))
    });
};
