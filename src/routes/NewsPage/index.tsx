import { Article, useNewsArticle } from "@app/hooks/useNewsArticle";
import { useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import { marked } from "marked";
import SanitizedHTML from "@app/components/SanitizedHTML";
import styles from "./NewsPage.module.css";
import NewsBadge from "@app/components/NewsSection/NewsBadge";
import { CSSProperties } from "react";
import { BackIcon, TimeIcon } from "@app/assets/Icons";
import { intlFormatDistance } from "date-fns";
import { newsBaseURL } from "@app/utils/consts";
import { useQueries } from "@tanstack/react-query";
import { useNewsAuthorSettings } from "@app/hooks/useNewsAuthor";
import NewsAuthor from "@app/components/NewsSection/NewsAuthor";

function NewsPage() {
    const { md } = useParams();
    if (!md) return <></>;

    const { data, error, isLoading, isSuccess } = useNewsArticle(md);
    const navigate = useNavigate();

    if (isLoading) return "Loading..";

    if (error) return `An error has occurred: ${error}`;

    if (isSuccess) {
        const article = matter(data);
        const articleData = article.data as Article;
        const content = article.content;

        const authors = useQueries({
            queries: articleData?.authors?.map((authorId) => useNewsAuthorSettings(authorId)) || []
        });

        let videoElem = <></>;
        if ("video" in articleData) {
            videoElem = <div className={styles.video_container}>
                <iframe
                    className={styles.video}
                    src="https://www.youtube.com/embed/Xk_HqhzvdgQ"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
            </div>;
        }

        return <>
            <div className={styles.header} style={{ "--bannerURL": `url(${newsBaseURL}/images/banners/${articleData.banner})` } as CSSProperties}>
                <div onClick={() => navigate(-1)} className={styles.header_back}>
                    <BackIcon />
                    RETURN
                </div>
                <div className={styles.header_info}>
                    <NewsBadge badgeType={articleData.type} />
                    <div className={styles.title}>{articleData.title}</div>
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
                        articleData.release ? (
                            <div className={styles.releaseDate}>
                                <TimeIcon />
                                {intlFormatDistance(new Date(articleData.release), new Date())}
                            </div>
                        ) : ""
                    }
                </div>
                {videoElem}
                <SanitizedHTML dirtyHTML={marked.parse(content)} />
            </div>
        </>;
    }
}

export default NewsPage;