import styles from "./NewsEntry.module.css";
import NewsBadge from "../NewsBadge";
import { ArticleData } from "@app/hooks/useNews";
import { Link } from "react-router-dom";
import { Img } from "react-image";
import UnknownUserIcon from "@app/assets/Icons/UnknownUser.svg";
import { TimeIcon } from "@app/assets/Icons";
import { intlFormatDistance } from "date-fns";
import { newsBaseURL } from "@app/utils/consts";
import { useNewsAuthorSettings } from "@app/hooks/useNewsAuthor";
import { useQueries } from "@tanstack/react-query";

interface Props {
    article: ArticleData;
}

const NewsEntry: React.FC<Props> = ({ article }: Props) => {

    const authors = useQueries({
        queries: article?.authors?.map(authorId => useNewsAuthorSettings(authorId)) || []
    });

    return <Link to={`/news/${article.md}`} key={article.md} style={{ width: "100%" }}>
        <div className={styles.container}>
            <img className={styles.thumbnail} src={`${newsBaseURL}/images/thumbs/${article.thumb}`} />
            <div className={styles.main}>
                <div className={styles.top_container}>
                    <div className={styles.top}>
                        <NewsBadge badgeType={article.type} />
                        {
                            article.release ? (
                                <div className={styles.releaseDate}>
                                    <TimeIcon height={15} />
                                    {intlFormatDistance(new Date(article.release), new Date())}
                                </div>
                            ) : ""
                        }
                    </div>
                    {article.title}
                </div>
                <div className={styles.bottom_container}>
                    {
                        authors
                            .filter(({data}) => data?.avatar)
                            .map(({data}) => (<Img
                                key={`${data?.avatar}`}
                                height={24}
                                alt={`${data?.displayName}'s avatar`}
                                src={[`${newsBaseURL}/images/avatars/${data?.avatar}`, UnknownUserIcon]}
                                style={{ borderRadius: "50%" }}
                            />))
                    }
                    <div>
                        By: <span className={styles.author}>{
                            authors
                                .map(({data}) => data?.displayName)
                                .filter(authorName => authorName)
                                .join(", ")
                        }</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>;
};

export default NewsEntry;