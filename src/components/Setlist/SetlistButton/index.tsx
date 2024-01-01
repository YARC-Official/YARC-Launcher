import { ButtonColor } from "../../Button";
import { CheckmarkIcon, InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import { calculatePayloadPercentage } from "@app/tasks/payload";
import PayloadProgress from "../../PayloadProgress";
import Button from "@app/components/Button";
import { DropdownButton, DropdownItem } from "@app/components/DropdownButton";
import { SetlistStates, SetlistVersion } from "@app/hooks/useSetlistData";

interface SetlistButtonProps extends React.PropsWithChildren {
    version: SetlistVersion,
    style?: React.CSSProperties
}

export function SetlistButton(props: SetlistButtonProps) {
    const version = props.version;

    if (version.state === SetlistStates.NEW_UPDATE) {
        const buttonChildren = <>
            <UpdateIcon /> Update Setlist
        </>;

        return <Button
            style={props.style}
            color={ButtonColor.GREEN}
            onClick={() => version.download()}>

            {buttonChildren}
        </Button>;
    }

    if (version.state === SetlistStates.DOWNLOADING) {
        const buttonChildren = <>
            <InstallingIcon />
            <PayloadProgress payload={version.payload} />
        </>;

        return <Button
            style={props.style}
            progress={calculatePayloadPercentage(version.payload)}
            color={ButtonColor.YELLOW}>

            {buttonChildren}
        </Button>;
    }

    if (version.state === SetlistStates.AVAILABLE) {
        const buttonChildren = <>
            <CheckmarkIcon /> Downloaded
        </>;

        const dropdownChildren = <>
            <DropdownItem onClick={() => version.uninstall()}>
                Uninstall
            </DropdownItem>
        </>;

        return <DropdownButton
            style={props.style}
            color={ButtonColor.BLUE}
            dropdownChildren={dropdownChildren}>

            {buttonChildren}
        </DropdownButton>;
    }

    if (version.state === SetlistStates.ERROR) {
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