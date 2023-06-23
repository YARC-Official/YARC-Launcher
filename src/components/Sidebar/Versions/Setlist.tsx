import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";
import { SetlistStates, useSetlistData } from "@app/hooks/useSetlistData";
import BaseVersion, { VersionType } from "./Base";
import { Link } from "react-router-dom";

interface Props {
    channel: SetlistID;
}

const SetlistVersion: React.FC<Props> = ({ channel }: Props) => {
    const setlistData = useSetlistRelease(channel);
    const { state } = useSetlistData(setlistData);

    return (
        <Link to={"/setlist/" + channel}>
            <BaseVersion
                programName="Setlist"
                versionChannel={`${setlistData?.songCount} songs`}
                version={setlistData?.version}
                updateAvailable={state === SetlistStates.NEW_UPDATE}
            />
        </Link>
    );
};

export default SetlistVersion;