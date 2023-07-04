import { SetlistDownload, generateSetlistUUID } from "@app/utils/Download/Processors/Setlist";
import BaseQueue from "./base";
import { useDownloadClient } from "@app/utils/Download/provider";
import SetlistIcon from "@app/assets/SourceIcons/Official.png";

interface Props {
    downloader: SetlistDownload
}

const SetlistQueue: React.FC<Props> = ({ downloader }: Props) => {
    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateSetlistUUID(downloader.id, downloader.version));

    return <BaseQueue
        name="YARG Setlist"
        icon={<img src={SetlistIcon} />}
        versionChannel={downloader.version}
        payload={payload}
    />;
};

export default SetlistQueue;