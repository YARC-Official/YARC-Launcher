import styles from "./Versions.module.css";
import VersionSeparator from "./Separator";
import { AddIcon } from "@app/assets/Icons";
import { useProfileStore } from "@app/stores/ProfileStore";
import { NavLink } from "react-router-dom";

const ProfilesList: React.FC = () => {
    const profileStore = useProfileStore();

    return <div className={styles.list}>
        <VersionSeparator name="Applications">
            <AddIcon className={styles.add} />
        </VersionSeparator>
        {
            profileStore.profiles.filter(i => i.type === "application").map(i =>
                <NavLink to={`/app-profile/${i.uuid}`} key={i.uuid}>
                    {i.metadata.locales["en-US"].name} ({i.version})
                </NavLink>
            )
        }
    </div>;
};

export default ProfilesList;
