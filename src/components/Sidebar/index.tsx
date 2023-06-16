import styles from "./Sidebar.module.css";
import { ReactComponent as DiscordIcon } from "@app/assets/Discord.svg";
import { ReactComponent as TwitterIcon } from "@app/assets/Twitter.svg";
import { ReactComponent as GithubIcon } from "@app/assets/Github.svg";
import { ReactComponent as NewsIcon } from "@app/assets/News.svg";
import { ReactComponent as SettingsIcon } from "@app/assets/Settings.svg";
import SidebarMenuButton from "./SidebarMenuButton";
import { Link } from "react-router-dom";
import VersionsList from "./Versions/List";

const Sidebar: React.FC = () => {
    return <div className={styles.sidebar}>

        <div className={styles.menus}>
            <Link to="/"><SidebarMenuButton>Home</SidebarMenuButton></Link>
            <Link to="/news"><SidebarMenuButton icon={<NewsIcon />}>News</SidebarMenuButton></Link>
            <Link to="/settings"><SidebarMenuButton icon={<SettingsIcon />}>Settings</SidebarMenuButton></Link>
        </div>

        <VersionsList />

        <div className={styles.footer}>
            <div className={styles.credits}>YARC 2023</div>
            <div className={styles.socials}>
                <a href="https://discord.gg/YARG" target="_blank" className={styles.link} rel="noreferrer"><DiscordIcon /></a>
                <a href="https://twitter.com/EliteAsian123" target="_blank" className={styles.link} rel="noreferrer"><TwitterIcon /></a>
                <a href="https://github.com/YARC-Official/YARG" target="_blank" className={styles.link} rel="noreferrer"><GithubIcon /></a>
            </div>
        </div>
    </div>;
};

export default Sidebar;