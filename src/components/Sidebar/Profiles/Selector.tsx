import { ProfileFolderState, useProfileState } from "@app/hooks/useProfileState";
import styles from "./Selector.module.css";
import ProfileIcon from "@app/components/ProfileIcon";
import { SidebarInQueueIcon, SidebarUpdateIcon } from "@app/assets/Icons";
import {useEffect, useRef, useState} from "react";

interface Props {
    name: string,
    uuid: string,
    iconUrl: string,
}

const Selector: React.FC<Props> = ({ name, uuid, iconUrl }: Props) => {
    const {
        loading,
        folderState,
        currentTask,
        activeProfile,
        launch,
        downloadAndInstall,
    } = useProfileState(uuid);

    const [launching, setLaunching] = useState<boolean>(false);
    const launchTimeoutRef = useRef<NodeJS.Timeout>();
    const lastPlayedChangeCount = useRef(0);
    //count how often this triggers to skip the first 2 on initialization
    useEffect(() => {
        if (lastPlayedChangeCount.current > 1 && activeProfile.profile.type === "application") {
            setLaunching(true);
            launchTimeoutRef.current = setTimeout(() => {
                setLaunching(false);
            }, 10 * 1000);
        }
        lastPlayedChangeCount.current++;
    }, [activeProfile.lastPlayed]);

    let tag = <></>;
    if (!loading) {
        if (currentTask !== undefined || launching) {
            tag = <div className={[styles.tagInQueue, styles.tag].join(" ")}>
                <SidebarInQueueIcon width={10} height={10} />
            </div>;
        } else if (folderState === ProfileFolderState.FirstDownload || folderState === ProfileFolderState.UpdateRequired) {
            tag = <div className={[styles.tagUpdate, styles.tag].join(" ")} onClick={async (e) => {
                e.preventDefault();
                await downloadAndInstall();
            }}>
                <SidebarUpdateIcon width={10} height={10} />
            </div>;
        } else if (folderState === ProfileFolderState.UpToDate && activeProfile.profile.type === "application") {
            tag = <button className={[styles.tagUpdate, styles.tag].join(" ")} onClick={async (e) => {
                e.preventDefault();
                await launch();
            }}>
                <SidebarUpdateIcon width={10} height={10} />
            </button>;
        }
    }

    const hasTask = currentTask !== undefined;

    return <div className={styles.selector}>
        <div className={styles.left}>
            <ProfileIcon className={styles.icon} iconUrl={iconUrl} />
            <div className={styles.text}>
                {name}
            </div>
        </div>
        <div key={hasTask ? "task" : "idle"}>
            {tag}
        </div>
    </div>;
};

export default Selector;
