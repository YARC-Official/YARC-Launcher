import { useQuery } from "@tanstack/react-query";

export interface ArticleData {
    md: string,
    type: string,
    title: string,
    thumb: string,
    author: string,
    avatar: string,
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
            "https://raw.githubusercontent.com/YARC-Official/News/master/index.json")
            .then(res => res.json())
    });
};