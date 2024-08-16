import { ButtonColor } from "@app/components/Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import Button from "@app/components/Button";
import { ProfileFolderState, ProfileState } from "@app/hooks/useProfileState";
import { localize } from "@app/utils/localized";
import { usePayload } from "@app/tasks/payload";
import PayloadProgress from "@app/components/PayloadProgress";

interface Props {
    profileState: ProfileState
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

    const payload = usePayload(currentTask?.taskUUID);

    const profile = activeProfile.profile;

    // Loading button
    if (loading) {
        return <Button color={ButtonColor.LIGHT} rounded border>
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
        return <Button color={ButtonColor.GREEN} rounded border onClick={async () => await downloadAndInstall()}>
            {folderState === ProfileFolderState.UpdateRequired &&
                <>
                    <UpdateIcon /> Update {releaseName}
                </>
            }
            {folderState === ProfileFolderState.FirstDownload &&
                <>
                    <UpdateIcon /> Install {releaseName}
                </>
            }
        </Button>;
    }

    // Launch/up-to-date button
    if (folderState === ProfileFolderState.UpToDate) {
        return <Button color={ButtonColor.BLUE} rounded border onClick={async () => await launch()}>
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
