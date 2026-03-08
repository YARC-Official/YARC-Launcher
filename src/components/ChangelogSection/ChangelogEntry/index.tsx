import styles from "./ChangelogEntry.module.css";
import { NightlyRelease } from "@app/profiles/types";
import {TimeIcon} from "@app/assets/Icons";
import {distanceFromToday} from "@app/utils/timeFormat";

interface Props {
    release: NightlyRelease;
}

const NightlyChangelogEntry: React.FC<Props> = ({ release }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Nightly Release {release.tagName}
                {
                    release.publishedAt ? (
                        <div className={styles.releaseDate}>
                            <TimeIcon height={15} />
                            {distanceFromToday(release.publishedAt.toString())}
                        </div>
                    ) : ""
                }
            </div>
            <div className={styles.commitList}>
                <ul>
                    {release.commits.map((commit) => (
                        <div key={commit.sha} className={styles.commitEntry}>
                            <li>{commit.summary} &mdash; <span className={styles.author}>{commit.author}</span></li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NightlyChangelogEntry;
