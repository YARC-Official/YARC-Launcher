import { NewsIcon } from "@app/assets/Icons";
import styles from "./NewsSection.module.css";
import NewsEntry from "./NewsEntry";

const NewsSection: React.FC = () => {
    return <div className={styles.container}>
        <div className={styles.header_container}>
            <div className={styles.header_text}>
                <NewsIcon width={15} height={15} /> NEWS
            </div>
        </div>
        <NewsEntry title="Wow! A test!" postBadge="Blog" author="Dai" />
        <NewsEntry title="Awesome!" postBadge="Update" author="Kadu" />
        <NewsEntry title="INSANE" postBadge="Huge W" author="TheNathannator" />
    </div>;
};

export default NewsSection;