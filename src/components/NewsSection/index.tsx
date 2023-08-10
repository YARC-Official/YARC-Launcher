import { NewsIcon } from "@app/assets/Icons";
import styles from "./NewsSection.module.css";
import NewsEntry from "./NewsEntry";
import { useNews } from "@app/hooks/useNews";
import { useState } from "react";

interface Props {
    categoryFilter?: string
    startingEntries?: number
}

const NewsSection: React.FC<Props> = ({ categoryFilter, startingEntries }: Props) => {
    const { data, error, isLoading, isSuccess } = useNews();
    const [displayCount, setDisplayCount] = useState(startingEntries ? startingEntries : 4);

    if (isLoading) return "Loading..";

    if (error) return `An error has occurred: ${error}`;

    if (isSuccess) {
        console.log(data);
        return <div className={styles.container}>
            <div className={styles.header_container}>
                <div className={styles.header_text}>
                    <NewsIcon width={15} height={15} /> NEWS
                </div>
            </div>
            {
                data.articles.filter(i => {
                    // Filter out everything that doesn't meet the filter
                    if (!categoryFilter) return true;
                    return i.category === categoryFilter;
                }).slice(0, displayCount).map(article => <NewsEntry article={article} key={article.md} />)
            }
            <div className={styles.load_more} onClick={() => setDisplayCount(displayCount + 4)}>Load More...</div>
        </div>;
    }
};

export default NewsSection;