import { NewsIcon } from "@app/assets/Icons";
import styles from "./NewsSection.module.css";
import NewsEntry from "./NewsEntry";
import { useNews } from "@app/hooks/useNews";

const NewsSection: React.FC = () => {
    const news = useNews();

    return <div className={styles.container}>
        <div className={styles.header_container}>
            <div className={styles.header_text}>
                <NewsIcon width={15} height={15} /> NEWS
            </div>
        </div>
        {
            Array.from(news.articles).map(article =>
                <NewsEntry title={article.title} postBadge={article.type} author={article.author} key={article.md} />
            )
        }
    </div>;
};

export default NewsSection;