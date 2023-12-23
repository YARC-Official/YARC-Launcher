import styles from "./Sidebar.module.css";
import { DiscordIcon, TwitterIcon, GithubIcon, HomeIcon, QueueIcon } from "@app/assets/Icons";
import SidebarMenuButton from "./SidebarMenuButton";
import { NavLink } from "react-router-dom";
import VersionsList from "./Versions/List";
import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { useDownloadClient } from "@app/tasks/provider";

const Sidebar: React.FC = () => {
    const [launcherVersion, setLauncherVersion] = useState("");

    const downloadClient = useDownloadClient();
    const queue = downloadClient.useQueue();
    const current = downloadClient.useCurrent();

    function getDownloadCount() {
        let count = queue.size;
        if (current) {
            count++;
        }

        return count;
    }

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
                    Downloads {getDownloadCount() <= 0 ? "" : `(${getDownloadCount()})`}
                </SidebarMenuButton>
            </NavLink>
        </div>

        <VersionsList />

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
