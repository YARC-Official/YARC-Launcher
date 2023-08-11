import { newsBaseURL } from "@app/utils/consts";
import { useQuery } from "@tanstack/react-query";

export interface Article {
    type: string,
    title: string,
    banner?: string,
    authors: string[],
    release?: string,
    video?: string
}

export const useNewsArticle = (md: string) => {
    return useQuery({
        queryKey: ["NewsArticle", md],
        cacheTime: 60 * 60 * 1000,
        queryFn: async () => await fetch(
            `${newsBaseURL}/articles/${md}.md`)
            .then(res => res.text())
    });
};