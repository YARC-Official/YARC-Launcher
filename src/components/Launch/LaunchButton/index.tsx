import { ButtonColor } from "../../Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import Button from "@app/components/Button";
import { DropdownButton, DropdownItem } from "@app/components/DropdownButton";
import { ProfileFolderState, useProfileState } from "@app/hooks/useProfileState";

interface LaunchButtonProps extends React.PropsWithChildren {
    profileUUID: string,
    style?: React.CSSProperties
}

export function LaunchButton({ profileUUID, ...props }: LaunchButtonProps) {
    const {
        loading,
        profile,
        folderState,
        currentTask,
        downloadAndInstall,
        uninstall,
        launch
    } = useProfileState(profileUUID);

    if (loading) {
        return <Button
            style={props.style}>
            Loading...
        </Button>;
    }

    let releaseName = "";
    if (profile.type === "application") {
        releaseName = profile.metadata.locales["en-US"].releaseName;
    }

    if (currentTask !== undefined) {
        const buttonChildren = <>
            <InstallingIcon />
            Installing...
            {/* <PayloadProgress payload={version.payload} /> */}
        </>;

        return <Button
            style={props.style}
            // progress={calculatePayloadPercentage(version.payload)}
            color={ButtonColor.YELLOW}>

            {buttonChildren}
        </Button>;
    }

    if (folderState === ProfileFolderState.UpdateRequired || folderState === ProfileFolderState.FirstDownload) {
        let buttonChildren;
        if (folderState === ProfileFolderState.UpdateRequired) {
            buttonChildren = <>
                <UpdateIcon /> Update {releaseName}
            </>;
        } else {
            buttonChildren = <>
                <UpdateIcon /> Install {releaseName}
            </>;
        }

        return <Button
            style={props.style}
            color={ButtonColor.GREEN}
            onClick={async () => await downloadAndInstall()}>

            {buttonChildren}
        </Button>;
    }

    if (folderState === ProfileFolderState.UpToDate) {
        let buttonChildren;
        if (profile.type === "application") {
            buttonChildren = <>
                Launch {releaseName}
            </>;
        } else {
            buttonChildren = <>
                Installed
            </>;
        }

        const dropdownChildren = <>
            <DropdownItem onClick={async () => await uninstall()}>
                Uninstall
            </DropdownItem>
            <DropdownItem onClick={() => {}}>
                Open Install Folder
            </DropdownItem>
        </>;

        return <DropdownButton
            style={props.style}
            color={ButtonColor.BLUE}
            onClick={async () => await launch()}
            dropdownChildren={dropdownChildren}>

            {buttonChildren}
        </DropdownButton>;
    }

    // if (folderState === ProfileFolderState) {
    //     const buttonChildren = <>
    //         Opening YARG {playName}
    //     </>;

    //     return <Button
    //         color={ButtonColor.GRAY}
    //         style={props.style}>

    //         {buttonChildren}
    //     </Button>;
    // }

    if (folderState === ProfileFolderState.Error) {
        const buttonChildren = <>
            Error!
        </>;

        return <Button
            color={ButtonColor.RED}
            style={props.style}>

            {buttonChildren}
        </Button>;
    }

    return <Button
        style={props.style}>
        Loading...
    </Button>;
}
