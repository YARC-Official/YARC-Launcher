import styles from "./Queue.module.css";
import QueueSection from "@app/components/Queue/QueueSection";
import PayloadProgress from "@app/components/PayloadProgress";
import * as Progress from "@radix-ui/react-progress";
import { useEffect, useState } from "react";
import { InstallingIcon, QueueListIcon } from "@app/assets/Icons";
import QueueStore from "@app/tasks/queue";
import { usePayload } from "@app/tasks/payload";
import { useCurrentTask } from "@app/tasks";

function Queue() {
    // These are for the "You've been staring at this blank page for..."
    const [lastWasEmpty, setLastWasEmpty] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [time, setTime] = useState(Date.now());

    const queue = QueueStore.useQueue();
    const currentTask = useCurrentTask();
    const payload = usePayload(currentTask?.taskUUID);

    // Update the timer so the text also updates
    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    function getProgressValue() {
        if (payload?.state === "downloading") {
            return payload.current / payload.total * 100.0;
        } else {
            return 100;
        }
    }

    function getBanner() {
        if (currentTask) {
            if (lastWasEmpty) {
                setLastWasEmpty(false);
            }

            return <div className={styles.banner}>
                <span className={styles.downloading_text}>DOWNLOADING</span>
                {currentTask?.getQueueEntry(true)}
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
            </div>;
        } else {
            // Make sure to update the start time when it becomes empty
            if (!lastWasEmpty) {
                setStartTime(Date.now());
                setLastWasEmpty(true);
            }

            const seconds = Math.round((time - startTime) / 1000);

            return <div className={styles.empty_banner}>
                <div className={styles.empty_banner_header}>
                    <InstallingIcon width={20} height={20} />
                    HOWDY COWBOY, GO DOWNLOAD SOMETHING
                </div>
                <div className={styles.empty_banner_subheader}>
                    You have been staring at this blank page for <strong>{seconds} seconds</strong>
                </div>
            </div>;
        }
    }

    return <>
        {getBanner()}
        <div className={styles.main}>
            <QueueSection icon={<QueueListIcon />} title="QUEUE">
                {
                    queue.size > 0 ?
                        // TO-DO: remove the first from queue list
                        Array.from(queue).map(downloader => downloader.getQueueEntry(false)) :
                        <div className={styles.empty_queue}>There are no downloads in the queue.</div>
                }
            </QueueSection>
        </div>
    </>;
}

export default Queue;