import { NewsIcon } from "@app/assets/Icons";
import styles from "./ChangelogSection.module.css";
import NightlyChangelogEntry from "./ChangelogEntry";
import { useNightlyReleases } from "@app/hooks/useNightlyReleases";
import { useState } from "react";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";

interface Props {
    startingEntries?: number
}

const ChangelogSection: React.FC<Props> = ({ startingEntries }: Props) => {
    const offlineStatus = useOfflineStatus();
    const queries = useNightlyReleases();
    const [displayCount, setDisplayCount] = useState(startingEntries ? startingEntries : 4);

    if (offlineStatus.isOffline) {
        return <div className={styles.offlineContainer}>
            Offline
        </div>;
    }

    const isLoading = queries.some(q => q.isLoading);
    const isError = queries.some(q => q.isError);

    if (isLoading) {
        return "Loading...";
    }

    if (isError) {
        return "An error has occurred while fetching nightly releases.";
    }

    const releases = queries
        .filter(q => q.isSuccess && q.data)
        .map(q => q.data!);

    if (releases.length === 0) {
        return null;
    }

    return <div className={styles.container}>
        <div className={styles.headerContainer}>
            <div className={styles.headerText}>
                <NewsIcon width={15} height={15} /> NIGHTLY CHANGELOG
            </div>
        </div>
        {
            releases.slice(0, displayCount).map(release => <NightlyChangelogEntry release={release} key={release.tagName} />)
        }
        {releases.length > displayCount && (
            <div className={styles.loadMore} onClick={() => setDisplayCount(displayCount + 4)}>Load More...</div>
        )}
    </div>;
};

export default ChangelogSection;
