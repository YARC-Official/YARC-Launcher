import { ProfileFolderState, useProfileState } from "@app/hooks/useProfileState";
import styles from "./Selector.module.css";
import ProfileIcon from "@app/components/ProfileIcon";
import { DownloadIcon, InstallIcon, InstallingIcon, TimeIcon, UpdateIcon } from "@app/assets/Icons";
import { usePayload } from "@app/tasks/payload";

interface Props {
    name: string,
    uuid: string,
    iconUrl: string,
}

const Selector: React.FC<Props> = ({ name, uuid, iconUrl }: Props) => {
    const {
        loading,
        folderState,
        currentTask
    } = useProfileState(uuid);

    const payload = usePayload(currentTask?.taskUUID);

    let tag = <></>;
    if (!loading) {
        if (currentTask !== undefined) {
            let taskIcon = <TimeIcon width={10} height={10} />;
            if (payload?.state === "downloading") {
                taskIcon = <DownloadIcon width={10} height={10} />;
            } else if (payload?.state === "installing" || payload?.state === "verifying") {
                taskIcon = <InstallingIcon width={10} height={10} />;
            }

            tag = <div className={[styles.tagInQueue, styles.tag].join(" ")}>
                {taskIcon}
            </div>;
        } else if (folderState === ProfileFolderState.UpdateRequired) {
            tag = <div className={[styles.tagUpdate, styles.tag].join(" ")}>
                <UpdateIcon width={10} height={10} />
            </div>;
        } else if (folderState === ProfileFolderState.FirstDownload) {
            tag = <div className={[styles.tagUpdate, styles.tag].join(" ")}>
                <InstallIcon width={10} height={10} />
            </div>;
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
