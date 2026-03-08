import styles from "./ChangelogEntry.module.css";
import { NightlyRelease } from "@app/profiles/types";

interface Props {
    release: NightlyRelease;
}

const NightlyChangelogEntry: React.FC<Props> = ({ release }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Nightly Release {release.tagName}
            </div>
            <div className={styles.commitList}>
                {release.commits.map((commit) => (
                    <div key={commit.sha} className={styles.commitEntry}>
                        {commit.summary} -- <span className={styles.author}>{commit.author}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NightlyChangelogEntry;
