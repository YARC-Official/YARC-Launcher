import { YARGDownload } from "@app/utils/Download/Processors/YARG";
import BaseQueue from "./base";
import StableYARGIcon from "@app/assets/StableYARGIcon.png";
import NightlyYARGIcon from "@app/assets/NightlyYARGIcon.png";
import DevYARGIcon from "@app/assets/DevYARGIcon.png";
import { YARGChannels } from "@app/hooks/useYARGRelease";

interface Props {
    downloader: YARGDownload,
    bannerMode: boolean,
}

const YARGQueue: React.FC<Props> = ({ downloader, bannerMode }: Props) => {

    const channelIconPath: { [key in YARGChannels]: string } = {
        "stable": StableYARGIcon,
        "nightly": NightlyYARGIcon,
        "newEngine": DevYARGIcon
    };

    return <BaseQueue
        name="YARG"
        icon={<img src={channelIconPath[downloader.channel]} />}
        version={downloader.version}
        versionChannel={downloader.channel.toUpperCase()}
        bannerMode={bannerMode}
    />;
};

export default YARGQueue;