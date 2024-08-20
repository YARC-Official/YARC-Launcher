import Button, { ButtonColor } from "@app/components/Button";
import styles from "./AppSettings.module.css";
import { useState } from "react";
import { ActiveProfile } from "@app/profiles/types";
import { localize } from "@app/utils/localized";
import { localizeMetadata } from "@app/profiles/utils";
import { useProfileStore } from "@app/profiles/store";

interface Props {
    activeProfile: ActiveProfile,
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppSettings: React.FC<Props> = ({ activeProfile, setSettingsOpen }: Props) => {
    let initalDisplayName = activeProfile.displayName;
    if (initalDisplayName === undefined) {
        initalDisplayName = localizeMetadata(activeProfile.profile, "en-US").name;
    }

    const [displayName, setDisplayName] = useState<string>(initalDisplayName);
    const [launchArguments, setLaunchArguments] = useState<string>(activeProfile.launchArguments);

    return <div className={styles.popup}>
        <div className={styles.body}>
            <div className={styles.content}>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                <input type="text" value={launchArguments} onChange={e => setLaunchArguments(e.target.value)} />
            </div>
            <div className={styles.navigation}>
                <Button color={ButtonColor.LIGHT} rounded
                    onClick={() => setSettingsOpen(false)}>
                    Discard Changes
                </Button>
                <Button color={ButtonColor.GREEN} rounded border
                    onClick={() => {
                        if (displayName !== initalDisplayName) {
                            activeProfile.displayName = displayName;
                        }

                        activeProfile.launchArguments = launchArguments;

                        useProfileStore.getState().updateProfile(activeProfile);

                        setSettingsOpen(false);
                    }}>
                    Save
                </Button>
            </div>
        </div>
    </div>;
};

export default AppSettings;

