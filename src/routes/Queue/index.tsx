import styles from "./Queue.module.css";
import SetlistQueue from "@app/components/Queue/QueueDownload/Setlist";
import QueueSection from "@app/components/Queue/QueueSection";
import { SetlistDownload } from "@app/utils/Download/Processors/Setlist";
import { YARGDownload } from "@app/utils/Download/Processors/YARG";
import { useDownloadClient } from "@app/utils/Download/provider";
import { ReactComponent as QueueListIcon } from "@app/assets/Icons/QueueList.svg";
import YARGQueue from "@app/components/Queue/QueueDownload/YARG";

function Queue() {
    const downloadClient = useDownloadClient();
    const queue = downloadClient.useQueue();

    return <>
        <div className={styles.main}>
            <QueueSection icon={<QueueListIcon />} title="QUEUE">
                {
                    queue.size > 0 ?
                        Array.from(queue).map(downloader => {
                            return downloader instanceof YARGDownload ? <YARGQueue downloader={downloader} /> :
                                downloader instanceof SetlistDownload ? <SetlistQueue downloader={downloader} /> : "";
                        }) :
                        ""
                }
            </QueueSection>
        </div>
    </>;
}

export default Queue;