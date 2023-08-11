import styles from "./NewsAuthor.module.css";
import UnknownUserIcon from "@app/assets/Icons/UnknownUser.svg";
import { AuthorData } from "@app/hooks/useNewsAuthor";
import { newsBaseURL } from "@app/utils/consts";
import { Img } from "react-image";

interface Props {
    author: AuthorData
}

const NewsAuthor: React.FC<Props> = ({author}: Props) => {
    return <div className={styles.author}>
        <div className={styles.avatar}>
            <Img
                height={48}
                alt={`${author.displayName}'s avatar`}
                src={[`${newsBaseURL}/images/avatars/${author.avatar}`, UnknownUserIcon]}
            />
        </div>
        <div className={styles.authorInformation}>
            <div className={styles.authorName}>{author.displayName}</div>
            <div className={styles.authorRole}>{author.role}</div>
        </div>
    </div>;
};

export default NewsAuthor;