import SetlistQueue from "@app/components/QueueDownload/Setlist";
import YARGQueue from "@app/components/QueueDownload/YARG";
import { SetlistDownload } from "@app/utils/Download/Processors/Setlist";
import { YARGDownload } from "@app/utils/Download/Processors/YARG";
import { useDownloadClient } from "@app/utils/Download/provider";

function Queue() {

    const downloadClient = useDownloadClient();
    const queue = downloadClient.useQueue();

    return (<>

        <h1>Queue page</h1>
        {
            queue.size > 0 ?
                Array.from(queue).map(downloader => {
                    return downloader instanceof YARGDownload ? <YARGQueue downloader={downloader} /> :
                        downloader instanceof SetlistDownload ? <SetlistQueue downloader={downloader} /> : "";
                }) :
                "No downloads on queue! :)"
        }

    </>);
}

export default Queue;