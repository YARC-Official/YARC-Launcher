import { YARGStates, YARGVersion } from "@app/hooks/useYARGVersion";
import Button, { ButtonColor } from "../../Button";
import { InstallingIcon, UpdateIcon } from "@app/assets/Icons";
import { calculatePayloadPercentage } from "@app/utils/Download/payload";
import PayloadProgress from "../../PayloadProgress";

interface LaunchButtonProps extends React.PropsWithChildren {
    version: YARGVersion,
    playName: string,
    style?: React.CSSProperties
}

export function LaunchButton(props: LaunchButtonProps) {
    const { version, playName } = props;

    if (version.state === YARGStates.NEW_UPDATE) {
        return <Button style={props.style} color={ButtonColor.GREEN} onClick={() => version.download()}>
            <UpdateIcon /> Update {playName}
        </Button>;
    }

    if (version.state === YARGStates.DOWNLOADING) {
        return <Button style={props.style} progress={calculatePayloadPercentage(version.payload)} color={ButtonColor.YELLOW}>
            <InstallingIcon />
            <PayloadProgress payload={version.payload} />
        </Button>;
    }

    if (version.state === YARGStates.AVAILABLE) {
        return <Button style={props.style} color={ButtonColor.BLUE} onClick={() => version.play()}>
            Play {playName}
        </Button>;
    }

    if (version.state === YARGStates.PLAYING) {
        return <Button color={ButtonColor.GRAY} style={props.style}>
            Opening YARG {playName}
        </Button>;
    }

    return <Button style={props.style}>
        Loading...
    </Button>;
}