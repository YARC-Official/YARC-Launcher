import { ButtonColor } from "@app/components/Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import Button from "@app/components/Button";
import { ProfileFolderState, ProfileState } from "@app/hooks/useProfileState";
import { localize } from "@app/utils/localized";

interface Props {
    profileState: ProfileState
}

export function LaunchButton({ profileState }: Props) {
    const {
        loading,
        profile,
        folderState,
        currentTask,
        downloadAndInstall,
        launch,
    } = profileState;

    // Loading button
    if (loading) {
        return <Button border={true} rounded={true} color={ButtonColor.LIGHT}>
            Loading...
        </Button>;
    }

    let releaseName = "";
    if (profile.type === "application") {
        releaseName = localize(profile.metadata, "releaseName", "en-US");
    }

    // Installing button
    if (currentTask !== undefined) {
        return <Button border={true} rounded={true} color={ButtonColor.YELLOW}>
            <InstallingIcon />
            Installing...
        </Button>;
    }

    // Update/install button
    if (folderState === ProfileFolderState.UpdateRequired || folderState === ProfileFolderState.FirstDownload) {
        return <Button border={true} rounded={true} color={ButtonColor.GREEN} onClick={async () => await downloadAndInstall()}>
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
        return <Button border={true} rounded={true} color={ButtonColor.BLUE} onClick={async () => await launch()}>
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
        return <Button border={true} rounded={true} color={ButtonColor.RED}>
            Error!
        </Button>;
    }

    return <Button border={true} rounded={true} color={ButtonColor.LIGHT}>
        Loading...
    </Button>;
}
