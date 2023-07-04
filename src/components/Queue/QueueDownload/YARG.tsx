import { YARGDownload, generateYARGUUID } from "@app/utils/Download/Processors/YARG";
import BaseQueue from "./base";
import { useDownloadClient } from "@app/utils/Download/provider";
import YARGIcon from "@app/assets/StableYARGIcon.png";

interface Props {
    downloader: YARGDownload
}

const YARGQueue: React.FC<Props> = ({ downloader }: Props) => {
    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateYARGUUID(downloader.version));

    return <BaseQueue
        name="YARG"
        icon={<img src={YARGIcon} />}
        version={downloader.version}
        versionChannel="TODO"
        payload={payload}
    />;
};

export default YARGQueue;