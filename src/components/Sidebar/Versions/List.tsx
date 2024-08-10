import styles from "./Versions.module.css";
import VersionSeparator from "./Separator";
import { AddIcon } from "@app/assets/Icons";
import { useProfileStore } from "@app/profiles/store";
import { NavLink } from "react-router-dom";
import { Localized, localize } from "@app/utils/localized";
import { Metadata } from "@app/profiles/types";

const ProfilesList: React.FC = () => {
    const profileStore = useProfileStore();

    function activeProfileList(type: "application" | "setlist") {
        const output = [];
        for (const activeProfile of profileStore.activeProfiles) {
            const profile = activeProfile.profile;
            if (profile.type !== type) {
                continue;
            }

            let name = activeProfile.displayName;
            if (name === undefined) {
                name = localize(profile.metadata as Localized<Metadata>, "name", "en-US");
            }

            output.push(
                <NavLink to={`/app-profile/${activeProfile.uuid}`} key={activeProfile.uuid}>
                    {name}
                </NavLink>
            );
        }
        return output;
    }

    return <div className={styles.list}>
        <VersionSeparator name="Applications">
            <AddIcon className={styles.add} />
        </VersionSeparator>
        {activeProfileList("application")}

        <VersionSeparator name="Songs">
            <AddIcon className={styles.add} />
        </VersionSeparator>
        {activeProfileList("setlist")}
    </div>;
};

export default ProfilesList;
