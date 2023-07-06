import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { YARGStates, useYARGVersion } from "@app/hooks/useYARGVersion";
import BaseVersion from "./Base";
import NightlyYARGIcon from "@app/assets/NightlyYARGIcon.png";
import StableYARGIcon from "@app/assets/StableYARGIcon.png";
import { Link } from "react-router-dom";

interface Props {
    channel: "stable" | "nightly";
}

const YARGVersion: React.FC<Props> = ({ channel }: Props) => {
    const releaseData = useYARGRelease(channel);
    const { state } = useYARGVersion(releaseData, channel);

    function getChannelIcon() {
        switch (channel) {
            case "stable":
                return StableYARGIcon;
            case "nightly":
                return NightlyYARGIcon;
        }
    }

    function getChannelDisplayName() {
        switch (channel) {
            case "stable":
                return "Stable";
            case "nightly":
                return "Nightly";
        }
    }

    return (
        <Link to={"/yarg/" + channel}>
            <BaseVersion
                icon={<img src={getChannelIcon()} alt="YARG" />}
                programName="YARG"
                versionChannel={getChannelDisplayName()}
                version={releaseData?.tag_name}
                updateAvailable={state === YARGStates.NEW_UPDATE}
            />
        </Link>
    );
};

export default YARGVersion;