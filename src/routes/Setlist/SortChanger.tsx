import { SetlistSong } from "@app/hooks/useSetlistRelease";
import styles from "./SortChanger.module.css";
import * as ToggleGroup from "@radix-ui/react-toggle-group";

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
            Song Name
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="artist">
            Artist Name
        </ToggleGroup.Item>
        <ToggleGroup.Item className={styles.item} value="length">
            Song Length
        </ToggleGroup.Item>
    </ToggleGroup.Root>;
};

export default SortChanger;