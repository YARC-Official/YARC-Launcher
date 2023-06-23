import { SetlistDownload, generateSetlistUUID } from "@app/utils/Download/Processors/Setlist";
import BaseQueue from "./base";
import { useDownloadClient } from "@app/utils/Download/provider";

interface Props {
    downloader: SetlistDownload
}

const SetlistQueue: React.FC<Props> = ({ downloader }: Props) => {
    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateSetlistUUID(downloader.id, downloader.version));

    return <BaseQueue
        name="Setlist"
        version={downloader.id + " - " + downloader.version}
        payload={payload}
    />;
};

export default SetlistQueue;