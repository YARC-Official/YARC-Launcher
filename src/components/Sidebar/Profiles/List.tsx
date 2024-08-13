import styles from "./List.module.css";
import Separator from "./Separator";
import { AddIcon } from "@app/assets/Icons";
import { useProfileStore } from "@app/profiles/store";
import { NavLink } from "react-router-dom";
import { Localized, localize } from "@app/utils/localized";
import { Metadata } from "@app/profiles/types";
import Selector from "./Selector";

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

            const iconUrl = localize(profile.metadata as Localized<Metadata>, "iconUrl", "en-US");

            output.push(
                <NavLink to={`/app-profile/${activeProfile.uuid}`} key={activeProfile.uuid}>
                    <Selector name={name} iconUrl={iconUrl} />
                </NavLink>
            );
        }
        return output;
    }

    return <div className={styles.list}>
        <Separator name="Applications">
            <AddIcon className={styles.add} />
        </Separator>
        {activeProfileList("application")}

        <Separator name="Songs">
            <AddIcon className={styles.add} />
        </Separator>
        {activeProfileList("setlist")}
    </div>;
};

export default ProfilesList;
