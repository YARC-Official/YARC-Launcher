import styles from "./SortChanger.module.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { DateIcon, NoteIcon, SongIcon, TimeIcon } from "@app/assets/Icons";
import { SetlistSong } from "@app/profiles/types";

export type SortType = keyof SetlistSong;

interface Props {
    sortType: SortType,
    setSortType: React.Dispatch<React.SetStateAction<keyof SetlistSong>>;
}

const SortChanger: React.FC<Props> = ({ sortType, setSortType }: Props) => {
    return <ToggleGroup.Root
        className={styles.container}
        type="single"
        value={sortType}
        onValueChange={(value: SortType | "") => {
            // We need to force an update here because the toggle group will deselect (which we don't want)
            if (value === "") {
                setSortType(sortType);
                return;
            }

            setSortType(value);
        }}>

        <ToggleGroup.Item className={styles.item} value="title">
            <NoteIcon />
            Track
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="artist">
            <SongIcon />
            Artist
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="length">
            <TimeIcon />
            Length
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="releaseDate">
            <DateIcon />
            Chart Release
        </ToggleGroup.Item>
    </ToggleGroup.Root>;
};

export default SortChanger;
