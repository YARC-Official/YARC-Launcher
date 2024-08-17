import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { closeDialog } from "..";

export class OfflineDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                <strong>The YARC Launcher cannot connect to the internet and is starting in offline mode.</strong>
                &#32;If your internet connection returns, restart the launcher to go back into online mode.
            </p>
        </>;
    }

    getTitle() {
        return <>Offline Mode</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GREEN} rounded onClick={() => closeDialog()}>
                Okay
            </Button>
        </>;
    }
}
