import { MoreIcon } from "@app/assets/Icons";
import Button, { ButtonColor } from "@app/components/Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./MoreDropdown.module.css";
import { ProfileState } from "@app/hooks/useProfileState";

interface Props {
    profileState: ProfileState
}

type ItemProps = React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLDivElement>
}>;

const MoreDropdown: React.FC<Props> = (props: Props) => {
    const {
        activeProfile,
        openInstallFolder,
        uninstall,
        deleteProfile
    } = props.profileState;

    const Item: React.FC<ItemProps> = (props: ItemProps) => {
        return <DropdownMenu.Item className={styles.item} onClick={props.onClick}>
            {props.children}
        </DropdownMenu.Item>;
    };

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
                    <Item onClick={async () => await openInstallFolder()}>
                        Open Install Folder
                    </Item>
                }

                <Item onClick={async () => await uninstall()}>
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
