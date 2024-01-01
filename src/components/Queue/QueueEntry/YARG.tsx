import { YARGTask } from "@app/tasks/Processors/YARG";
import BaseQueue from "./base";
import StableYARGIcon from "@app/assets/StableYARGIcon.png";
import NightlyYARGIcon from "@app/assets/NightlyYARGIcon.png";
import { YARGChannels } from "@app/hooks/useYARGRelease";

interface Props {
    yargTask: YARGTask,
    bannerMode: boolean,
}

const YARGQueue: React.FC<Props> = ({ yargTask, bannerMode }: Props) => {
    const channelIconPath: { [key in YARGChannels]: string } = {
        "stable": StableYARGIcon,
        "nightly": NightlyYARGIcon
    };

    return <BaseQueue
        name="YARG"
        icon={<img src={channelIconPath[yargTask.channel]} />}
        version={yargTask.version}
        versionChannel={yargTask.channel.toUpperCase()}
        bannerMode={bannerMode}
    />;
};

export default YARGQueue;