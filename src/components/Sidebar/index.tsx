import styles from "./Sidebar.module.css";
import { DiscordIcon, TwitterIcon, GithubIcon, HomeIcon, QueueIcon, MarketplaceIcon } from "@app/assets/Icons";
import SidebarMenuButton from "./SidebarMenuButton";
import { NavLink } from "react-router-dom";
import ProfilesList from "./Versions/List";
import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import QueueStore from "@app/tasks/queue";

const Sidebar: React.FC = () => {
    const [launcherVersion, setLauncherVersion] = useState("");
    const queue = QueueStore.useQueue();

    useEffect(() => {
        (async () => {
            setLauncherVersion(await getVersion());
        })();
    }, []);

    return <div className={styles.sidebar}>
        <div className={styles.menus}>
            <NavLink to="/">
                <SidebarMenuButton icon={<HomeIcon />}>
                    Home
                </SidebarMenuButton>
            </NavLink>
            {/* <NavLink to="/settings"><SidebarMenuButton icon={<SettingsIcon />}>Settings</SidebarMenuButton></NavLink> */}
            <NavLink to="/queue">
                <SidebarMenuButton icon={<QueueIcon />}>
                    Downloads {queue.size <= 0 ? "" : `(${queue.size})`}
                </SidebarMenuButton>
            </NavLink>
            <NavLink to="/marketplace">
                <SidebarMenuButton icon={<MarketplaceIcon />}>
                    Marketplace
                </SidebarMenuButton>
            </NavLink>
        </div>

        <ProfilesList />

        <div className={styles.footer}>
            <div className={styles.credits}>v{launcherVersion}</div>
            <div className={styles.socials}>
                <a href="https://discord.gg/sqpu4R552r" target="_blank" className={styles.link} rel="noreferrer"><DiscordIcon /></a>
                <a href="https://twitter.com/EliteAsian123" target="_blank" className={styles.link} rel="noreferrer"><TwitterIcon /></a>
                <a href="https://github.com/YARC-Official/YARG" target="_blank" className={styles.link} rel="noreferrer"><GithubIcon /></a>
            </div>
        </div>
    </div>;
};

export default Sidebar;
