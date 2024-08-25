import styles from "./Home.module.css";
import NewsSection from "@app/components/NewsSection";
import YARCLogo from "@app/assets/YARCSquare.png";
import { askOpenUrl } from "@app/utils/safeUrl";
import { DiscordIcon, GithubIcon, RedditIcon, TwitterIcon, YoutubeIcon } from "@app/assets/Icons";

function Home() {
    return <main className={styles.container}>
        <div className={styles.banner}>
            <img src={YARCLogo} />
            <div className={styles.socials}>
                <DiscordIcon onClick={async () => await askOpenUrl("https://discord.gg/sqpu4R552r")} />
                <GithubIcon onClick={async () => await askOpenUrl("https://github.com/YARC-Official")} />
                <TwitterIcon onClick={async () => await askOpenUrl("https://x.com/yarggame")} />
                <YoutubeIcon onClick={async () => await askOpenUrl("https://www.youtube.com/@YARGGame")} />
                <RedditIcon onClick={async () => await askOpenUrl("https://www.reddit.com/r/yarg/")} />
            </div>
        </div>
        <div className={styles.content}>
            <NewsSection startingEntries={7} />
        </div>
    </main>;
}

export default Home;
