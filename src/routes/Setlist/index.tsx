import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";
import styles from "./setlist.module.css";
import { SetlistStates, useSetlistData } from "@app/hooks/useSetlistData";
import { GenericBox, GenericBoxHeader, GenericBoxSlim } from "@app/components/GenericBox";
import SongEntry from "@app/components/Setlist/SongEntry";
import { InformationIcon, ChartersIcon, OrganizerIcon, DateIcon, SongIcon, TimeIcon, UpdateIcon, InstallingIcon, CheckmarkIcon } from "@app/assets/Icons";
import CreditEntry from "@app/components/Setlist/CreditEntry";
import { isConsideredNewRelease, millisToDisplayLength } from "@app/utils/timeFormat";
import Button, { ButtonColor } from "@app/components/Button";
import PayloadProgress from "@app/components/PayloadProgress";
import TooltipWrapper from "@app/components/TooltipWrapper";
import { calculatePayloadPercentage } from "@app/utils/Download/payload";
import { useDialogManager } from "@app/dialogs/DialogProvider";
import { intlFormatDistance } from "date-fns";
import NewsSection from "@app/components/NewsSection";
import SortChanger, { SortType } from "./SortChanger";
import { useState } from "react";
import sortArray from "sort-array";

interface Props {
    setlistId: SetlistID
}

interface SetlistButtonProps extends React.PropsWithChildren {
    style?: React.CSSProperties
}

const SetlistPage: React.FC<Props> = ({ setlistId }: Props) => {
    const setlistData = useSetlistRelease(setlistId);
    const { state, download, payload } = useSetlistData(setlistData);
    const [ sortType, setSortType ] = useState("title" as SortType);

    const dialogManager = useDialogManager();

    function SetlistButton(props: SetlistButtonProps) {
        if (state === SetlistStates.AVAILABLE) {
            return <Button style={props.style} color={ButtonColor.BLUE}>
                <CheckmarkIcon /> Downloaded
            </Button>;
        } else if (state === SetlistStates.DOWNLOADING) {
            if (!payload) {
                return <></>;
            }

            return <Button style={props.style} progress={calculatePayloadPercentage(payload)} color={ButtonColor.YELLOW}>
                <InstallingIcon />
                <PayloadProgress payload={payload} />
            </Button>;
        } else {
            return <Button style={props.style} color={ButtonColor.GREEN} onClick={() => download(dialogManager)}>
                <UpdateIcon /> Update Setlist
            </Button>;
        }
    }

    const newestSongRelease = setlistData.songs.reduce((prev, curr) =>
        new Date(prev.releaseDate).getTime() > new Date(curr.releaseDate).getTime() ? prev : curr);

    return <>
        <div className={styles.banner} />
        <div className={styles.main}>
            <div className={styles.content}>
                <SortChanger onChange={(s) => setSortType(s)} />

                <GenericBoxSlim>
                    {sortArray(setlistData.songs, {
                        by: "order",
                        order: sortType === "releaseDate" ? "desc" : "asc",
                        computed: {
                            order: i => {
                                const value = i[sortType];

                                // Speical case for release date
                                if (sortType === "releaseDate" && typeof value === "string") {
                                    return new Date(value).getTime();
                                }

                                // Make sure strings are in all lowercase for proper sorting
                                if (typeof value === "string") {
                                    return value.toLowerCase();
                                }

                                return value;
                            }
                        }
                    }).map(i =>
                        <SongEntry title={i.title} artist={i.artist} length={i.length}
                            newSong={isConsideredNewRelease(i.releaseDate, newestSongRelease.releaseDate)} key={i.title} />
                    )}
                </GenericBoxSlim>

                <div className={styles.content_spacer}></div>
                <NewsSection categoryFilter="setlist_official" startingEntries={2} />
            </div>
            <div className={styles.sidebar}>
                <SetlistButton style={{ width: "100%" }} />
                <GenericBox>
                    <GenericBoxHeader>
                        <InformationIcon />
                        {setlistData.locales["en-US"].title}
                    </GenericBoxHeader>

                    {setlistData.locales["en-US"].description}

                    <div className={styles.info_list}>
                        <TooltipWrapper
                            text={`Release Date (${intlFormatDistance(new Date(setlistData.releaseDate), new Date())})`}
                            className={styles.info_entry}>

                            <DateIcon />
                            {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date(setlistData.releaseDate))}
                        </TooltipWrapper>

                        <TooltipWrapper text="Song Count" className={styles.info_entry}>
                            <SongIcon />
                            {setlistData.songs.length} songs
                        </TooltipWrapper>

                        <TooltipWrapper text="Setlist Length" className={styles.info_entry}>
                            <TimeIcon />
                            {millisToDisplayLength(setlistData.songs.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.length,
                                0), true)}
                        </TooltipWrapper>

                        <TooltipWrapper text="Organizer" className={styles.info_entry}>
                            <OrganizerIcon />
                            {setlistData.organizer}
                        </TooltipWrapper>
                    </div>
                </GenericBox>

                <GenericBox>
                    <GenericBoxHeader>
                        <ChartersIcon />
                        Charters
                    </GenericBoxHeader>

                    <div className={styles.info_list}>
                        {setlistData.credits.map(i =>
                            <CreditEntry creditEntry={i} key={i.name} />
                        )}
                    </div>
                </GenericBox>
            </div>
        </div>
    </>;
};

export default SetlistPage;