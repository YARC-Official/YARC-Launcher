import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";
import { SetlistStates, useSetlistData } from "@app/hooks/useSetlistData";
import BaseVersion, { VersionType } from "./Base";
import { NavLink } from "react-router-dom";
import OfficialIcon from "@app/assets/SourceIcons/Official.png";

interface Props {
    channel: SetlistID;
}

const SetlistVersion: React.FC<Props> = ({ channel }: Props) => {
    const { data: setlistData } = useSetlistRelease(channel);
    const { state } = useSetlistData(setlistData, channel);

    return (
        <NavLink to={"/setlist/" + channel}>
            <BaseVersion
                icon={<img src={OfficialIcon} />} // TO-DO: create a util/sourceIcon to get source icon from
                type={VersionType.SONG}
                programName={setlistData?.locales["en-US"].title} // TO-DO: catch the BCP 47 code
                versionChannel={`${setlistData?.songs?.length} songs`}
                updateAvailable={state === SetlistStates.NEW_UPDATE}
            />
        </NavLink>
    );
};

export default SetlistVersion;