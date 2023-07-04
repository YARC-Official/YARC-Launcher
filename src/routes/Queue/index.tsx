import styles from "./Queue.module.css";
import QueueSection from "@app/components/Queue/QueueSection";
import { useDownloadClient } from "@app/utils/Download/provider";
import { ReactComponent as QueueListIcon } from "@app/assets/Icons/QueueList.svg";
import PayloadProgress from "@app/components/PayloadProgress";
import * as Progress from "@radix-ui/react-progress";

function Queue() {
    const downloadClient = useDownloadClient();
    const queue = downloadClient.useQueue();
    const current = downloadClient.useCurrent();
    const payload = downloadClient.usePayload(current?.uuid);

    function getProgressValue() {
        if (payload?.state === "downloading") {
            return payload.current / payload.total * 100.0;
        } else {
            return 100;
        }
    }

    return <>
        <div className={styles.banner}>
            <span className={styles.downloading_text}>DOWNLOADING</span>
            {current?.getQueueEntry(true)}
            <div className={styles.progress_container}>
                <div className={styles.progress_info}>
                    <PayloadProgress payload={payload} fullMode />
                </div>
                <Progress.Root className={styles.progress_bar_root} value={getProgressValue()}>
                    <Progress.Indicator
                        className={styles.progress_bar_indicator}
                        style={{ width: `${getProgressValue()}%` }}
                    />
                </Progress.Root>
            </div>
        </div>
        <div className={styles.main}>
            <QueueSection icon={<QueueListIcon />} title="QUEUE">
                {
                    Array.from(queue).map(downloader => downloader.getQueueEntry(false))
                }
            </QueueSection>
        </div>
    </>;
}

export default Queue;