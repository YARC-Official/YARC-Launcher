import Button, { ButtonColor } from "@app/components/Button";
import styles from "./AppSettings.module.css";
import { useState } from "react";
import { ActiveProfile } from "@app/profiles/types";
import { localize } from "@app/utils/localized";
import { localizeMetadata } from "@app/profiles/utils";
import { useProfileStore } from "@app/profiles/store";
import InputBox from "@app/components/InputBox";

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
                <div className={styles.setting}>
                    <p>Display Name</p>
                    <InputBox state={displayName} setState={setDisplayName} placeholder="Display name..." />
                </div>
                <div className={styles.setting}>
                    <p>Additional Launch Arguments</p>
                    <InputBox state={launchArguments} setState={setLaunchArguments} placeholder="Launch arguments..." />
                </div>
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
