import styles from "./Home.module.css";
import NewsSection from "@app/components/NewsSection";

function Home() {
    return <main className={styles.content}>
        <NewsSection startingEntries={7} />
    </main>;
}

export default Home;
