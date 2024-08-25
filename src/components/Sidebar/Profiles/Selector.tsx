import { ProfileFolderState, useProfileState } from "@app/hooks/useProfileState";
import styles from "./Selector.module.css";
import ProfileIcon from "@app/components/ProfileIcon";
import { SidebarInQueueIcon, SidebarUpdateIcon } from "@app/assets/Icons";

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

    let tag = <></>;
    if (!loading) {
        if (currentTask !== undefined) {
            tag = <div className={[styles.tagInQueue, styles.tag].join(" ")}>
                <SidebarInQueueIcon width={10} height={10} />
            </div>;
        } else if (folderState === ProfileFolderState.FirstDownload || folderState === ProfileFolderState.UpdateRequired) {
            tag = <div className={[styles.tagUpdate, styles.tag].join(" ")}>
                <SidebarUpdateIcon width={10} height={10} />
            </div>;
        }
    }

    return <div className={styles.selector}>
        <div className={styles.left}>
            <ProfileIcon className={styles.icon} iconUrl={iconUrl} />
            <div className={styles.text}>
                {name}
            </div>
        </div>
        {tag}
    </div>;
};

export default Selector;
