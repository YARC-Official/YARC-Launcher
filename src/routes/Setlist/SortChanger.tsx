import { SetlistSong } from "@app/hooks/useSetlistRelease";
import styles from "./SortChanger.module.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { DateIcon, NoteIcon, SongIcon, TimeIcon } from "@app/assets/Icons";

export type SortType = keyof SetlistSong;

interface Props {
    onChange: (sortType: SortType) => void;
}

const SortChanger: React.FC<Props> = ({ onChange }: Props) => {
    return <ToggleGroup.Root
        className={styles.container}
        type="single"
        defaultValue="title"
        onValueChange={(value: SortType) => onChange(value)}>

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
            Release
        </ToggleGroup.Item>
    </ToggleGroup.Root>;
};

export default SortChanger;