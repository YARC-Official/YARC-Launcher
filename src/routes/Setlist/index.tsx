import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";
import styles from "./setlist.module.css";
import { SetlistStates, useSetlistData } from "@app/hooks/useSetlistData";
import { SetlistBox, SetlistBoxHeader, SetlistBoxSlim } from "@app/components/Setlist/SetlistBox";
import SongEntry from "@app/components/Setlist/SongEntry";
import { ReactComponent as InfoIcon } from "@app/assets/Information.svg";
import { ReactComponent as CharterIcon } from "@app/assets/Charters.svg";
import { ReactComponent as OrganizerIcon } from "@app/assets/Organizer.svg";
import { ReactComponent as DateIcon } from "@app/assets/Date.svg";
import { ReactComponent as SongIcon } from "@app/assets/Song.svg";
import { ReactComponent as TimeIcon } from "@app/assets/Time.svg";
import { ReactComponent as UpdateIcon } from "@app/assets/Update.svg";
import { ReactComponent as InstallingIcon } from "@app/assets/Installing.svg";
import { ReactComponent as CheckmarkIcon } from "@app/assets/Checkmark.svg";
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
                    <SongEntry title={i.title} artist={i.artist} length={i.length} key={i.title} />
                )}
            </SetlistBoxSlim>
            <div className={styles.sidebar}>
                {getButton()}
                <SetlistBox>
                    <SetlistBoxHeader>
                        <InfoIcon />
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
                        <CharterIcon />
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