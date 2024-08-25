import styles from "./Sidebar.module.css";
import SidebarMenuButton from "./SidebarMenuButton";
import { NavLink } from "react-router-dom";
import ProfilesList from "./Profiles/List";
import QueueStore from "@app/tasks/queue";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";
import useMarketIndex from "@app/hooks/useMarketIndex";
import { settingsManager } from "@app/settings";
import { askOpenUrl } from "@app/utils/safeUrl";

import {
    DiscordIcon,
    TwitterIcon,
    GithubIcon,
    HomeIcon,
    QueueIcon,
    MarketplaceIcon,
    YoutubeIcon,
    RedditIcon
} from "@app/assets/Icons";

const Sidebar: React.FC = () => {
    const offlineStatus = useOfflineStatus();
    const queue = QueueStore.useQueue();

    const marketIndex = useMarketIndex(!offlineStatus.isOffline);
    let isNewMarketplace = false;

    if (!marketIndex.isLoading && !marketIndex.isError && marketIndex.data !== undefined) {
        try {
            isNewMarketplace = Date.parse(marketIndex.data.lastUpdated)
                > Date.parse(settingsManager.getCache("lastMarketplaceObserve"));
        } catch {
            // Ignore error in this case
        }
    }

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
            {!offlineStatus.isOffline &&
                <NavLink to="/marketplace">
                    <SidebarMenuButton icon={<MarketplaceIcon />}>
                        Marketplace
                        {isNewMarketplace &&
                            <div className={styles.updatedTag}>
                                Updated!
                            </div>
                        }
                    </SidebarMenuButton>
                </NavLink>
            }
        </div>

        <ProfilesList isOffline={offlineStatus.isOffline} />

        <div className={styles.footer}>
            <div className={styles.socials}>
            </div>
        </div>
    </div>;
};

export default Sidebar;
