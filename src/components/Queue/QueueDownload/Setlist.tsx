import { SetlistDownload } from "@app/utils/Download/Processors/Setlist";
import BaseQueue from "./base";
import SetlistIcon from "@app/assets/SourceIcons/Official.png";

interface Props {
    downloader: SetlistDownload,
    bannerMode: boolean,
}

const SetlistQueue: React.FC<Props> = ({ downloader, bannerMode }: Props) => {
    return <BaseQueue
        name="YARG Setlist"
        icon={<img src={SetlistIcon} />}
        versionChannel={downloader.version}
        bannerMode={bannerMode}
    />;
};

export default SetlistQueue;