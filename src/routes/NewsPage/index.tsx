import { useNewsArticle } from "@app/hooks/useNewsArticle";
import { Link, useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import { marked } from "marked";
import SanitizedHTML from "@app/components/SanitizedHTML";
import styles from "./NewsPage.module.css";
import NewsBadge from "@app/components/NewsSection/NewsBadge";
import { CSSProperties } from "react";
import { BackIcon, TimeIcon } from "@app/assets/Icons";
import { Img } from "react-image";
import UnknownUserIcon from "@app/assets/Icons/UnknownUser.svg";
import { intlFormatDistance } from "date-fns";

function NewsPage() {
    const { md } = useParams();
    if (!md) return <></>;

    const { data, error, isLoading, isSuccess } = useNewsArticle(md);

    if (isLoading) return "Loading..";

    if (error) return `An error has occurred: ${error}`;

    if (isSuccess) {
        const { data: articleData, content } = matter(data);
        const navigate = useNavigate();

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
            <div className={styles.header} style={{ "--bannerURL": `url(https://raw.githubusercontent.com/YARC-Official/News/master/images/banners/${articleData.banner})` } as CSSProperties}>
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
                    <div className={styles.author}>
                        <div className={styles.avatar}>
                            <Img
                                height={48}
                                alt={`${articleData.author}'s avatar`}
                                src={[`https://raw.githubusercontent.com/YARC-Official/News/master/images/avatars/${articleData.avatar}`, UnknownUserIcon]}
                            />
                        </div>
                        <div className={styles.authorInformation}>
                            <div className={styles.authorName}>{articleData.author}</div>
                            <div className={styles.authorRole}>{articleData.role}</div>
                        </div>
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