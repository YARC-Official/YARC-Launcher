import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";
import { ButtonColor } from "../../Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import { calculatePayloadPercentage } from "@app/utils/Download/payload";
import PayloadProgress from "../../PayloadProgress";
import DropdownButton from "@app/components/DropdownButton";

interface LaunchButtonProps extends React.PropsWithChildren {
    version: YARGVersion,
    playName: string,
    style?: React.CSSProperties
}

export function LaunchButton(props: LaunchButtonProps) {
    const { version, playName } = props;

    const dropdownContents = <>

    </>;

    if (version.state === YARGStates.NEW_UPDATE) {
        const buttonChildren = <>
            <UpdateIcon /> Update {playName}
        </>;

        return <DropdownButton
            style={props.style}
            color={ButtonColor.GREEN}
            onClick={() => version.download()}
            buttonChildren={buttonChildren}>

            {dropdownContents}
        </DropdownButton>;
    }

    if (version.state === YARGStates.DOWNLOADING) {
        const buttonChildren = <>
            <InstallingIcon />
            <PayloadProgress payload={version.payload} />
        </>;

        return <DropdownButton
            style={props.style}
            progress={calculatePayloadPercentage(version.payload)}
            color={ButtonColor.YELLOW}
            buttonChildren={buttonChildren}>

            {dropdownContents}
        </DropdownButton>;
    }

    if (version.state === YARGStates.AVAILABLE) {
        const buttonChildren = <>
            Play {playName}
        </>;

        return <DropdownButton
            style={props.style}
            color={ButtonColor.BLUE}
            onClick={() => version.play()}
            buttonChildren={buttonChildren}>

            {dropdownContents}
        </DropdownButton>;
    }

    if (version.state === YARGStates.PLAYING) {
        const buttonChildren = <>
            Opening YARG {playName}
        </>;

        return <DropdownButton
            color={ButtonColor.GRAY}
            style={props.style}
            buttonChildren={buttonChildren}>

            {dropdownContents}
        </DropdownButton>;
    }

    return <DropdownButton
        style={props.style}
        buttonChildren={<>Loading...</>}>

        {dropdownContents}
    </DropdownButton >;
}