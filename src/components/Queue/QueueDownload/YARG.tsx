import { YARGDownload } from "@app/utils/Download/Processors/YARG";
import BaseQueue from "./base";
import YARGIcon from "@app/assets/StableYARGIcon.png";

interface Props {
    downloader: YARGDownload,
    bannerMode: boolean,
}

const YARGQueue: React.FC<Props> = ({ downloader, bannerMode }: Props) => {
    return <BaseQueue
        name="YARG"
        icon={<img src={YARGIcon} />}
        version={downloader.version}
        versionChannel="TODO"
        bannerMode={bannerMode}
    />;
};

export default YARGQueue;