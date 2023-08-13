import { YARGChannels, useYARGRelease } from "@app/hooks/useYARGRelease";
import { YARGStates, useYARGVersion } from "@app/hooks/useYARGVersion";
import BaseVersion from "./Base";
import NightlyYARGIcon from "@app/assets/NightlyYARGIcon.png";
import StableYARGIcon from "@app/assets/StableYARGIcon.png";
import DevYARGIcon from "@app/assets/DevYARGIcon.png";
import { NavLink } from "react-router-dom";

interface Props {
    channel: YARGChannels
}

const YARGVersion: React.FC<Props> = ({ channel }: Props) => {
    const {data: releaseData} = useYARGRelease(channel);
    const { state } = useYARGVersion(releaseData, channel);

    function getChannelIcon() {
        switch (channel) {
            case "stable":
                return StableYARGIcon;
            case "nightly":
                return NightlyYARGIcon;
            case "newEngine":
                return DevYARGIcon;
        }
    }

    function getChannelDisplayName() {
        switch (channel) {
            case "stable":
                return "Stable";
            case "nightly":
                return "Nightly";
            case "newEngine":
                return "New Engine";
        }
    }

    return (
        <NavLink to={"/yarg/" + channel}>
            <BaseVersion
                icon={<img src={getChannelIcon()} alt="YARG" />}
                programName="YARG"
                versionChannel={getChannelDisplayName()}
                version={releaseData?.tag_name}
                updateAvailable={state === YARGStates.NEW_UPDATE}
            />
        </NavLink>
    );
};

export default YARGVersion;