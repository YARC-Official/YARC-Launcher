import styles from "./List.module.css";
import Separator from "./Separator";
import { AddIcon } from "@app/assets/Icons";
import { useProfileStore } from "@app/profiles/store";
import { Link, NavLink } from "react-router-dom";
import { Localized, localize } from "@app/utils/localized";
import { Metadata } from "@app/profiles/types";
import Selector from "./Selector";
import TooltipWrapper from "@app/components/TooltipWrapper";

interface Props {
    isOffline: boolean;
}

const ProfilesList: React.FC<Props> = ({ isOffline }: Props) => {
    const profileStore = useProfileStore();

    function activeProfileList(type: "application" | "setlist" | "venue") {
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
                    <Selector name={name} uuid={activeProfile.uuid} iconUrl={iconUrl} />
                </NavLink>
            );
        }

        return output;
    }

    return <div className={styles.list}>
        <Separator name="Applications">
            {!isOffline &&
                <TooltipWrapper text="Look for Applications on the Marketplace" sideOffset={3}>
                    <Link to="/marketplace" className={styles.add}>
                        <AddIcon />
                    </Link>
                </TooltipWrapper>
            }
        </Separator>
        {activeProfileList("application")}

        <Separator name="Setlists">
            {!isOffline &&
                <TooltipWrapper text="Look for Setlists on the Marketplace" sideOffset={3}>
                    <Link to="/marketplace" className={styles.add}>
                        <AddIcon />
                    </Link>
                </TooltipWrapper>
            }
        </Separator>
        {activeProfileList("setlist")}
        <Separator name="Venues">
            {!isOffline &&
                <TooltipWrapper text="Look for Venues on the Marketplace" sideOffset={3}>
                    <Link to="/marketplace" className={styles.add}>
                        <AddIcon />
                    </Link>
                </TooltipWrapper>
            }
        </Separator>
        {activeProfileList("venue")}
    </div>;
};

export default ProfilesList;
