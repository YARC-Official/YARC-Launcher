import { UnknownUserIcon } from "@app/assets/Icons";
import styles from "./NewsEntry.module.css";
import NewsBadge from "../NewsBadge";

interface Props {
    title: string;
    postBadge: string;
    author: string;
}

const NewsEntry: React.FC<Props> = ({ title, postBadge, author }: Props) => {
    return <div className={styles.container}>
        <img className={styles.thumbnail} />
        <div className={styles.main}>
            <div className={styles.top_container}>
                <div className={styles.top}>
                    <NewsBadge>{postBadge}</NewsBadge>
                </div>
                {title}
            </div>
            <div className={styles.bottom_container}>
                <UnknownUserIcon />
                <div>
                    By: <span className={styles.author}>{author}</span>
                </div>
            </div>
        </div>
    </div>;
};

export default NewsEntry;