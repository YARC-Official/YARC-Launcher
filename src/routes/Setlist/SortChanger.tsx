import { SetlistSong } from "@app/hooks/useSetlistRelease";
import styles from "./SortChanger.module.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { NoteIcon, SongIcon, TimeIcon } from "@app/assets/Icons";

export type SortType = keyof SetlistSong;

interface Props {
    onChange: (sortType: SortType) => void;
}

const SortChanger: React.FC<Props> = ({ onChange }: Props) => {
    return <ToggleGroup.Root
        className={styles.container}
        type="single"
        defaultValue="title"
        onValueChange={(value) => onChange(value as SortType)}>
        
        <ToggleGroup.Item className={styles.item} value="title">
            <NoteIcon />
            Song Name
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="artist">
            <SongIcon />
            Artist Name
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="length">
            <TimeIcon />
            Song Length
        </ToggleGroup.Item>
    </ToggleGroup.Root>;
};

export default SortChanger;