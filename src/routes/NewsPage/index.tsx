import { Article, useNewsArticle } from "@app/hooks/useNewsArticle";
import { useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import { marked } from "marked";
import SanitizedHTML from "@app/components/SanitizedHTML";
import styles from "./NewsPage.module.css";
import NewsBadge from "@app/components/NewsSection/NewsBadge";
import { CSSProperties } from "react";
import { BackIcon, TimeIcon } from "@app/assets/Icons";
import { formatDistance } from "date-fns";
import { useQueries } from "@tanstack/react-query";
import { useNewsAuthorSettings } from "@app/hooks/useNewsAuthor";
import NewsAuthor from "@app/components/NewsSection/NewsAuthor";
import urlParser from "js-video-url-parser/lib/base";
import "js-video-url-parser/lib/provider/youtube";

function NewsPage() {
    const { md } = useParams();
    if (!md) return <></>;

    const { data, error } = useNewsArticle(md);
    const navigate = useNavigate();

    const article = matter(data || "");
    const articleData = article.data as Article | undefined;
    const content = article.content;

    const authors = useQueries({
        queries: articleData?.authors?.map((authorId) => useNewsAuthorSettings(authorId)) || []
    });

    const video = articleData?.video ? urlParser.parse(articleData.video) : undefined;

    if (error) return `An error has occurred: ${error}`;

    return <>
        <div className={styles.header} style={{ "--bannerURL": `url(${import.meta.env.VITE_NEWS_SERVER_URL}/images/banners/${articleData?.banner})` } as CSSProperties}>
            <div onClick={() => navigate(-1)} className={styles.header_back}>
                <BackIcon />
                    RETURN
            </div>
            <div className={styles.header_info}>
                {
                    articleData?.type ? <NewsBadge badgeType={articleData?.type} /> : ""
                }
                <div className={styles.title}>{articleData?.title}</div>
            </div>
        </div >
        <div className={styles.content}>
            <div className={styles.info}>
                <div className={styles.authors}>
                    {
                        authors
                            .filter(query => query.data)
                            .map(({data}) => {
                                if(!data) return; 
                                return <NewsAuthor key={data?.displayName} author={data} />;
                            })
                    }
                </div>
                {
                    articleData?.release ? (
                        <div className={styles.releaseDate}>
                            <TimeIcon />
                            {formatDistance(new Date(articleData?.release), new Date())}
                        </div>
                    ) : ""
                }
            </div>

            {
                video?.id ? <iframe
                    className={styles.video}
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                /> : ""
            }

            <SanitizedHTML 
                dirtyHTML={ marked.parse(content, {async: false}) as string } 
            />
        </div>
    </>;
}

export default NewsPage;