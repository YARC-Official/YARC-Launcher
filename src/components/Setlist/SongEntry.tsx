import { millisToDisplayLength } from "@app/utils/timeFormat";
import { TimeIcon } from "@app/assets/Icons";
import styles from "./SongEntry.module.css";
import { SetlistSong } from "@app/profiles/types";

interface Props {
    song: SetlistSong,
    isNewSong: boolean,
}

const SongEntry: React.FC<Props> = ({ song, isNewSong }: Props) => {
    return <div className={styles.song}>
        <div className={styles.trackContainer}>
            <span className={styles.trackTitle}>{song.title}</span>
            <span className={styles.trackArtist}>{song.artist}</span>
            {isNewSong &&
                <div className={styles.newBadge}>NEW</div>
            }
        </div>
        <div className={styles.extraContainer}>
            <span className={styles.extraLength}>{millisToDisplayLength(song.length)}</span>
            <TimeIcon className={styles.icon} />
        </div>
    </div>;
};

export default SongEntry;
