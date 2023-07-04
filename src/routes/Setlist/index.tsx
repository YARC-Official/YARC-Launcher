import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";
import styles from "./setlist.module.css";
import { SetlistStates, useSetlistData } from "@app/hooks/useSetlistData";
import { SetlistBox, SetlistBoxHeader, SetlistBoxSlim } from "@app/components/Setlist/SetlistBox";
import SongEntry from "@app/components/Setlist/SongEntry";
import { InformationIcon, ChartersIcon, OrganizerIcon, DateIcon, SongIcon, TimeIcon, UpdateIcon, InstallingIcon, CheckmarkIcon } from "@app/assets/Icons";
import CreditEntry from "@app/components/Setlist/CreditEntry";
import { millisToDisplayLength } from "@app/utils/timeFormat";
import Button, { ButtonColor } from "@app/components/Button";
import PayloadProgress from "@app/components/PayloadProgress";

interface Props {
    setlistId: SetlistID
}

const SetlistPage: React.FC<Props> = ({ setlistId }: Props) => {
    const setlistData = useSetlistRelease(setlistId);
    const { state, download, payload } = useSetlistData(setlistData);

    function getButton() {
        if (state === SetlistStates.AVAILABLE) {
            return <Button color={ButtonColor.BLUE}>
                <CheckmarkIcon /> Downloaded
            </Button>;
        } else if (state === SetlistStates.DOWNLOADING) {
            if (!payload) {
                return <></>;
            }

            return <Button color={ButtonColor.YELLOW}>
                <InstallingIcon />
                <PayloadProgress payload={payload} />
            </Button>;
        } else {
            return <Button color={ButtonColor.GREEN} onClick={() => download()}>
                <UpdateIcon /> Download
            </Button>;
        }
    }

    return <>
        <div className={styles.banner} />
        <div className={styles.main}>
            <SetlistBoxSlim style={{ flex: "1 0 0" }}>
                {setlistData.songs.map(i =>
                    <SongEntry title={i.title} artist={i.artist} length={i.length} newSong={!!i.new} key={i.title} />
                )}
            </SetlistBoxSlim>
            <div className={styles.sidebar}>
                {getButton()}
                <SetlistBox>
                    <SetlistBoxHeader>
                        <InformationIcon />
                        {setlistData.locales["en-US"].title}
                    </SetlistBoxHeader>

                    {setlistData.locales["en-US"].description}

                    <div className={styles.info_list}>
                        <div className={styles.info_entry}>
                            <DateIcon />
                            {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date(setlistData.releaseDate))}
                        </div>

                        <div className={styles.info_entry}>
                            <SongIcon />
                            {setlistData.songs.length} songs
                        </div>

                        <div className={styles.info_entry}>
                            <TimeIcon />
                            {millisToDisplayLength(setlistData.songs.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.length,
                                0), true)}
                        </div>

                        <div className={styles.info_entry}>
                            <OrganizerIcon />
                            {setlistData.organizer}
                        </div>
                    </div>
                </SetlistBox>

                <SetlistBox>
                    <SetlistBoxHeader>
                        <ChartersIcon />
                        Charters
                    </SetlistBoxHeader>

                    <div className={styles.info_list}>
                        {setlistData.credits.map(i =>
                            <CreditEntry creditEntry={i} key={i.name} />
                        )}
                    </div>
                </SetlistBox>
            </div>
        </div>
    </>;
};

export default SetlistPage;