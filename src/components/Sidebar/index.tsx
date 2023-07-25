import styles from "./Sidebar.module.css";
import { DiscordIcon, TwitterIcon, GithubIcon, HomeIcon, QueueIcon } from "@app/assets/Icons";
import SidebarMenuButton from "./SidebarMenuButton";
import { Link } from "react-router-dom";
import VersionsList from "./Versions/List";
import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { useDownloadClient } from "@app/utils/Download/provider";

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
            <Link to="/"><SidebarMenuButton icon={<HomeIcon />}>Home</SidebarMenuButton></Link>
            {/* <Link to="/settings"><SidebarMenuButton icon={<SettingsIcon />}>Settings</SidebarMenuButton></Link> */}
            <Link to="/queue">
                <SidebarMenuButton icon={<QueueIcon />}>
                    Downloads {getDownloadCount() <= 0 ? "" : `(${getDownloadCount()})`}
                </SidebarMenuButton>
            </Link>
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
