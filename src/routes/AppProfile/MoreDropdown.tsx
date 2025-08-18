import { MoreIcon } from "@app/assets/Icons";
import Button, { ButtonColor } from "@app/components/Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./MoreDropdown.module.css";
import { ProfileFolderState, ProfileState } from "@app/hooks/useProfileState";

type ItemProps = React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLDivElement>
    disabled?: boolean;
}>;

const Item: React.FC<ItemProps> = (props: ItemProps) => {
    return <DropdownMenu.Item 
        className={`${styles.item} ${props.disabled ? styles.disabled : ""}`}
        onClick={props.disabled ? undefined : props.onClick}
        aria-disabled={props.disabled}>
        {props.children}
    </DropdownMenu.Item>;
};

interface Props {
    profileState: ProfileState
}

const MoreDropdown: React.FC<Props> = (props: Props) => {
    const {
        activeProfile,
        folderState,
        openInstallFolder,
        uninstall,
        deleteProfile
    } = props.profileState;

    return <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            <Button color={ButtonColor.DARK} rounded border style={{padding: "15px"}}>
                <MoreIcon />
            </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content
                className={styles.content}
                sideOffset={5}
                align="end">

                {activeProfile.profile.type === "application" &&
                    <Item 
                        onClick={async () => await openInstallFolder()}
                        disabled={folderState === ProfileFolderState.FirstDownload}>
                        Open Install Folder
                    </Item>
                }

                <Item 
                    onClick={async () => await uninstall()}
                    disabled={folderState === ProfileFolderState.FirstDownload}>
                    Uninstall
                </Item>
                <Item onClick={async () => await deleteProfile()}>
                    Delete Profile
                </Item>

                <DropdownMenu.Arrow className={styles.arrow} />
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>;
};

export default MoreDropdown;
