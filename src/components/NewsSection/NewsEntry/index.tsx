import styles from "./NewsEntry.module.css";
import NewsBadge from "../NewsBadge";
import { ArticleData } from "@app/hooks/useNews";
import { Link } from "react-router-dom";
import { Img } from "react-image";
import UnknownUserIcon from "@app/assets/Icons/UnknownUser.svg";
import { TimeIcon } from "@app/assets/Icons";
import { intlFormatDistance } from "date-fns";

interface Props {
    article: ArticleData;
}

const NewsEntry: React.FC<Props> = ({ article }: Props) => {
    return <Link to={`news/${article.md}`} key={article.md} style={{ width: "100%" }}>
        <div className={styles.container}>
            <img className={styles.thumbnail} src={`https://raw.githubusercontent.com/YARC-Official/News/master/images/thumbs/${article.thumb}`} />
            <div className={styles.main}>
                <div className={styles.top_container}>
                    <div className={styles.top}>
                        <NewsBadge>{article.type}</NewsBadge>
                        {
                            article.release ? (
                                <div className={styles.releaseDate}>
                                    <TimeIcon height={15}/>
                                    { intlFormatDistance(new Date(article.release), new Date()) }
                                </div>
                            ) : ""
                        }
                    </div>
                    {article.title}
                </div>
                <div className={styles.bottom_container}>
                    <Img
                        height={24}
                        alt={`${article.author}'s avatar`}
                        src={[`https://raw.githubusercontent.com/YARC-Official/News/master/images/avatars/${article.avatar}`, UnknownUserIcon]}
                        style={{borderRadius: "50%"}}
                    />
                    <div>
                        By: <span className={styles.author}>{article.author}</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>;
};

export default NewsEntry;