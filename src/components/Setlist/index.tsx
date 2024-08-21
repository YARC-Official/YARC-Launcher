import { Profile, SetlistMetadata } from "@app/profiles/types";
import { localizeMetadata } from "@app/profiles/utils";
import SortChanger, { SortType } from "./SortChanger";
import { useState } from "react";
import Box from "@app/components/Box";
import sortArray from "sort-array";
import SongEntry from "./SongEntry";
import { isConsideredNewRelease } from "@app/utils/timeFormat";

interface Props {
    profile: Profile
}

const Setlist: React.FC<Props> = ({ profile }: Props) => {
    const [ sortType, setSortType ] = useState<SortType>("title");

    if (profile.type !== "setlist") {
        return <></>;
    }

    const metadata = localizeMetadata(profile, "en-US") as SetlistMetadata;

    const newestSongRelease = metadata.songs.reduce((prev, curr) =>
        Date.parse(prev.releaseDate) > Date.parse(curr.releaseDate) ? prev : curr);

    return <>
        <SortChanger sortType={sortType} setSortType={setSortType} />
        <Box style={{alignSelf: "stretch", paddingTop: "8px", paddingBottom: "8px"}}>
            {
                sortArray(metadata.songs, {
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
                    <SongEntry
                        song={i}
                        isNewSong={isConsideredNewRelease(i.releaseDate, newestSongRelease.releaseDate)}
                        key={JSON.stringify(i)} />
                )
            }
        </Box>
    </>;
};

export default Setlist;
