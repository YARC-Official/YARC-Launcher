import { SetlistData } from "@app/hooks/useSetlistRelease";
import styles from "./setlist.module.css";
import { SetlistVersion } from "@app/hooks/useSetlistData";
import { GenericBox, GenericBoxHeader, GenericBoxSlim } from "@app/components/GenericBox";
import SongEntry from "@app/components/Setlist/SongEntry";
import { InformationIcon, ChartersIcon, OrganizerIcon, DateIcon, SongIcon, TimeIcon } from "@app/assets/Icons";
import CreditEntry from "@app/components/Setlist/CreditEntry";
import { isConsideredNewRelease, millisToDisplayLength } from "@app/utils/timeFormat";
import TooltipWrapper from "@app/components/TooltipWrapper";
import { intlFormatDistance } from "date-fns";
import NewsSection from "@app/components/NewsSection";
import SortChanger, { SortType } from "@app/components/Setlist/SortChanger";
import { useState } from "react";
import sortArray from "sort-array";
import { SetlistButton } from "@app/components/Setlist/SetlistButton";

interface Props {
    version: SetlistVersion,
    data: SetlistData,
}

const SetlistPage: React.FC<Props> = ({ version, data }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        console.log(version);
        return <p>Error: No version.</p>;
    }

    const [ sortType, setSortType ] = useState("title" as SortType);

    const newestSongRelease = data.songs.reduce((prev, curr) =>
        new Date(prev.releaseDate).getTime() > new Date(curr.releaseDate).getTime() ? prev : curr);

    return <>
        <div className={styles.banner} />
        <div className={styles.main}>
            <div className={styles.content}>
                <SortChanger onChange={(s) => setSortType(s)} />

                <GenericBoxSlim>
                    {sortArray(data.songs, {
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
                <SetlistButton version={version} style={{ width: "100%" }} />
                <GenericBox>
                    <GenericBoxHeader>
                        <InformationIcon />
                        {data.locales["en-US"].title}
                    </GenericBoxHeader>

                    {data.locales["en-US"].description}

                    <div className={styles.info_list}>
                        <TooltipWrapper
                            text={`Release Date (${intlFormatDistance(new Date(data.releaseDate), new Date())})`}
                            className={styles.info_entry}>

                            <DateIcon />
                            {new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date(data.releaseDate))}
                        </TooltipWrapper>

                        <TooltipWrapper text="Song Count" className={styles.info_entry}>
                            <SongIcon />
                            {data.songs.length} songs
                        </TooltipWrapper>

                        <TooltipWrapper text="Setlist Length" className={styles.info_entry}>
                            <TimeIcon />
                            {millisToDisplayLength(data.songs.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.length,
                                0), true)}
                        </TooltipWrapper>

                        <TooltipWrapper text="Organizer" className={styles.info_entry}>
                            <OrganizerIcon />
                            {data.organizer}
                        </TooltipWrapper>
                    </div>
                </GenericBox>

                <GenericBox>
                    <GenericBoxHeader>
                        <ChartersIcon />
                        Charters
                    </GenericBoxHeader>

                    <div className={styles.info_list}>
                        {data.credits.map(i =>
                            <CreditEntry creditEntry={i} key={i.name} />
                        )}
                    </div>
                </GenericBox>
            </div>
        </div>
    </>;
};

export default SetlistPage;