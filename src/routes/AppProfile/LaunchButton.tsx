import { ButtonColor } from "@app/components/Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import Button from "@app/components/Button";
import { ProfileFolderState, ProfileState } from "@app/hooks/useProfileState";
import { localize } from "@app/utils/localized";
import { usePayload } from "@app/tasks/payload";
import PayloadProgress from "@app/components/PayloadProgress";
import { useEffect, useRef, useState } from "react";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";
import {
    DropdownButton,
    DropdownRadioGroup, DropdownRadioGroupIndicator,
    DropdownRadioItem
} from "@app/components/Button/DropdownButton";
import {useProfileStore} from "@app/profiles/store";
import {ActiveProfile} from "@app/profiles/types";


interface Props {
    profileState: ProfileState
}

async function saveProfile(profile: ActiveProfile) {
    await useProfileStore.getState().updateProfile(profile);
}

export function LaunchButton({ profileState }: Props) {
    const {
        loading,
        activeProfile,
        folderState,
        currentTask,
        downloadAndInstall,
        launch,
    } = profileState;

    const offlineStatus = useOfflineStatus();
    const payload = usePayload(currentTask?.taskUUID);

    const [launching, setLaunching] = useState<boolean>(false);
    const launchTimeoutRef = useRef<NodeJS.Timeout>();

    // Make sure to reset the launching status when the profile changes
    useEffect(() => {
        setLaunching(false);
        clearTimeout(launchTimeoutRef.current);
    }, [activeProfile]);

    const profile = activeProfile.profile;

    // Loading button
    if (loading || launching) {
        return <Button color={ButtonColor.DARK} rounded border>
            Loading...
        </Button>;
    }

    let releaseName = "";
    if (profile.type === "application") {
        releaseName = localize(profile.metadata, "releaseName", "en-US");
    }

    // Installing button
    if (currentTask !== undefined) {
        if (payload !== undefined) {
            return <Button color={ButtonColor.YELLOW} rounded border>
                <InstallingIcon />
                <PayloadProgress payload={payload} />
            </Button>;
        } else {
            return <Button color={ButtonColor.YELLOW} rounded border>
                <InstallingIcon />
                In Queue
            </Button>;
        }
    }

    // Update/install button
    if (folderState === ProfileFolderState.UpdateRequired || folderState === ProfileFolderState.FirstDownload) {
        if (offlineStatus.isOffline) {
            return <Button color={ButtonColor.DARK} rounded border>
                Offline
            </Button>;
        }

        // No alternatives
        if (profileState.activeProfile.version.alternatives === undefined || profileState.activeProfile.version.alternatives.length < 2) {
            return <Button color={ButtonColor.GREEN} rounded border onClick={async () => await downloadAndInstall()}>
                {folderState === ProfileFolderState.UpdateRequired &&
                    <>
                        <UpdateIcon/> Update {releaseName}
                    </>
                }
                {folderState === ProfileFolderState.FirstDownload &&
                    <>
                        <UpdateIcon/> Install {releaseName}
                    </>
                }
            </Button>;
        }

        // Use a DropdownButton so the user can select their preferred alternative download

        let dropdownDefault;
        if (profileState.activeProfile.selectedAlternative === undefined) {
            // dropdownDefault = profileState.activeProfile.version.alternatives.findLastIndex((alternative) => alternative.default === true);
            dropdownDefault = profileState.activeProfile.version.alternatives.find(alternative => alternative.default === true)?.uuid;
        } else {
            dropdownDefault = profileState.activeProfile.selectedAlternative;
            // dropdownDefault = profileState.activeProfile.version.alternatives.findIndex((alternative) => alternative.label === profileState.activeProfile.selectedAlternative.label);

        }

        const dropdownElements = profileState.activeProfile.version.alternatives.map((alternative) => {
            return <DropdownRadioItem key={alternative.uuid} label={alternative.label} value={alternative.uuid} onClick={() => {
                profileState.activeProfile.selectedAlternative = alternative.uuid;
                saveProfile(profileState.activeProfile);
            }}>
                {alternative.label}
                <DropdownRadioGroupIndicator />
            </DropdownRadioItem>;
        });

        const dropdownItems = <><DropdownRadioGroup defaultValue={dropdownDefault} value={profileState.activeProfile.selectedAlternative} onValueChange={() => {}}>{dropdownElements}</DropdownRadioGroup></>;

        return <DropdownButton color={ButtonColor.GREEN} rounded border
            onClick={async () => await downloadAndInstall()}
            dropdownChildren={dropdownItems}>
            {folderState === ProfileFolderState.UpdateRequired &&
                <>
                    <UpdateIcon/> Update {releaseName}
                </>
            }
            {folderState === ProfileFolderState.FirstDownload &&
                <>
                    <UpdateIcon/> Install {releaseName}
                </>
            }

        </DropdownButton>;
    }

    // Launch/up-to-date button
    if (folderState === ProfileFolderState.UpToDate) {
        return <Button color={ButtonColor.BLUE} rounded border onClick={async () => {
            if (profile.type === "application") {
                setLaunching(true);
                launchTimeoutRef.current = setTimeout(() => {
                    setLaunching(false);
                }, 10 * 1000);
            }

            await launch();
        }}>
            {profile.type === "application" &&
                <>
                    Launch {releaseName}
                </>
            }
            {profile.type === "setlist" &&
                <>
                    Installed
                </>
            }
            {profile.type === "venue" &&
                <>
                    Installed
                </>
            }
        </Button>;
    }

    // Errored button
    if (folderState === ProfileFolderState.Error) {
        return <Button color={ButtonColor.RED} rounded border>
            Error!
        </Button>;
    }

    return <Button color={ButtonColor.LIGHT} rounded border>
        Loading...
    </Button>;
}
