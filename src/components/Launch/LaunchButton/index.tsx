import { ButtonColor } from "../../Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import { calculatePayloadPercentage } from "@app/tasks/payload";
import PayloadProgress from "../../PayloadProgress";
import Button from "@app/components/Button";
import { DropdownButton, DropdownItem } from "@app/components/DropdownButton";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { getPathForProfile, useProfileStore } from "@app/stores/ProfileStore";
import { showErrorDialog } from "@app/dialogs/dialogUtil";

enum ProfileFolderState {
    Error = 0,
    UpToDate = 1,
    UpdateRequired = 2,
    FirstDownload = 3
}

interface LaunchButtonProps extends React.PropsWithChildren {
    profileUUID: string,
    style?: React.CSSProperties
}

export function LaunchButton({ profileUUID, ...props }: LaunchButtonProps) {
    const [folderState, setFolderState] = useState<ProfileFolderState>(0);
    const profiles = useProfileStore();

    const profile = profiles.getProfileByUUID(profileUUID);
    if (profile === undefined) {
        return <></>;
    }

    useEffect(() => {
        (async () => {
            const result = await invoke("profile_folder_state", {
                path: await getPathForProfile(profiles, profile),
                profileVersion: profile.version
            }) as ProfileFolderState;
            setFolderState(result);
        })();
    }, []);

    let releaseName = "";
    if (profile.type === "application") {
        releaseName = profile.metadata.locales["en-US"].releaseName;
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
            onClick={async () => {
                try {
                    await invoke("download_and_install_profile", {
                        profilePath: await getPathForProfile(profiles, profile),
                        uuid: profile.uuid,
                        version: profile.version,
                        tempPath: profiles.importantDirs?.tempFolder,
                        content: profile.content
                    });
                } catch (e) {
                    showErrorDialog(e as string);
                }
            }}>

            {buttonChildren}
        </Button>;
    }

    // if (version.state === YARGStates.DOWNLOADING) {
    //     const buttonChildren = <>
    //         <InstallingIcon />
    //         <PayloadProgress payload={version.payload} />
    //     </>;

    //     return <Button
    //         style={props.style}
    //         progress={calculatePayloadPercentage(version.payload)}
    //         color={ButtonColor.YELLOW}>

    //         {buttonChildren}
    //     </Button>;
    // }

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
            <DropdownItem onClick={() => {}}>
                Uninstall
            </DropdownItem>
            <DropdownItem onClick={() => {}}>
                Open Install Folder
            </DropdownItem>
        </>;

        return <DropdownButton
            style={props.style}
            color={ButtonColor.BLUE}
            onClick={() => {}}
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
