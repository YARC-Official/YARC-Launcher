import { useQuery } from "@tanstack/react-query";

export interface ArticleData {
    md: string,
    type: string,
    title: string,
    thumb: string,
    authors: string[],
    release: string,
    category: string
}

export interface NewsData {
    articles: ArticleData[]
}

export const useNews = () => {
    return useQuery({
        queryKey: ["NewsIndex"],
        queryFn: async (): Promise<NewsData> => await fetch(
            `${import.meta.env.VITE_NEWS_SERVER_URL}/index.json`)
            .then(res => res.json())
    });
};