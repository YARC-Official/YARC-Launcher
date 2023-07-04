import styles from "./Queue.module.css";
import QueueSection from "@app/components/Queue/QueueSection";
import { useDownloadClient } from "@app/utils/Download/provider";
import { ReactComponent as QueueListIcon } from "@app/assets/Icons/QueueList.svg";

function Queue() {
    const downloadClient = useDownloadClient();
    const queue = downloadClient.useQueue();
    const current = downloadClient.useCurrent();

    return <>
        <div className={styles.main}>
            {current?.getQueueEntry()}

            <QueueSection icon={<QueueListIcon />} title="QUEUE">
                {
                    Array.from(queue).map(downloader => downloader.getQueueEntry())
                }
            </QueueSection>
        </div>
    </>;
}

export default Queue;