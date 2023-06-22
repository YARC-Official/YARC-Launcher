import { YARGDownload, generateYARGUUID } from "@app/utils/Download/Processors/YARG";
import BaseQueue from "./base";
import { useDownloadClient } from "@app/utils/Download/provider";

interface Props {
    downloader: YARGDownload
}

const YARGQueue: React.FC<Props> = ({downloader}: Props) => {
    const downloadClient = useDownloadClient();
    const payload = downloadClient.usePayload(generateYARGUUID(downloader.version));
    
    return <BaseQueue 
        name="YARG"
        version={downloader.version}
        payload={payload}    
    />;
};

export default YARGQueue;