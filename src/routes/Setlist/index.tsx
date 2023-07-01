import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";
import styles from "./setlist.module.css";
import { useSetlistData } from "@app/hooks/useSetlistData";
import { SetlistBox, SetlistBoxHeader, SetlistBoxSlim } from "@app/components/Setlist/SetlistBox";
import SongEntry from "@app/components/Setlist/SongEntry";
import { ReactComponent as InfoIcon } from "@app/assets/Information.svg";

interface Props {
    setlistId: SetlistID
}

const SetlistPage: React.FC<Props> = ({ setlistId }: Props) => {
    const setlistData = useSetlistRelease(setlistId);
    const { download } = useSetlistData(setlistData);

    // Get list of songs
    const songList = [];
    for (const song of setlistData.songs) {
        songList.push(<SongEntry title={song.title} artist={song.artist} length={song.length} />);
    }

    return <div className={styles.main}>
        <SetlistBoxSlim style={{ flex: "1 0 0" }}>
            {songList}
        </SetlistBoxSlim>
        <div className={styles.sidebar}>
            <button className={styles.download_button} onClick={() => download()}>Download</button>
            <SetlistBox>
                <SetlistBoxHeader>
                    <InfoIcon />
                    {setlistData.locales["en-US"].title}
                </SetlistBoxHeader>

                {setlistData.locales["en-US"].description}
            </SetlistBox>
        </div>
    </div>;
};

export default SetlistPage;