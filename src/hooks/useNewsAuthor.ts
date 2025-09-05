import { useQuery } from "@tanstack/react-query";

export interface AuthorData {
    displayName: string,
    avatar?: string,
    role?: string,
}

export const useNewsAuthorSettings = (authorId: string) => { 
    return {
        queryKey: ["NewsAuthor", authorId],
        queryFn: async (): Promise<AuthorData> => await fetch(
            `${import.meta.env.VITE_NEWS_SERVER_URL}/authors/${authorId}.json`)
            .then(res => res.json())
    };
};

export const useNewsAuthor = (authorId: string) => {
    return useQuery(useNewsAuthorSettings(authorId));
};