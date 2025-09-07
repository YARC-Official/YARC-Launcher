import {BaseDialog} from "@app/dialogs/Dialogs/BaseDialog";
import Button, {ButtonColor} from "@app/components/Button";
import {closeDialog} from "@app/dialogs";

export class MsvcDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>The Microsoft Visual C++ 14 Redistributable is required for this application to run correctly.
                <strong>You will not be able to use MIDI devices without this installation.</strong></p>
            <p>Do you want to install it now?</p>
        </>;
    }

    getTitle() {
        return <>Installation Required</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.LIGHT} rounded onClick={() => closeDialog()}>Not Now</Button>
            <Button color={ButtonColor.GREEN} rounded onClick={() => closeDialog("continue")}>Install Now</Button>
        </>;
    }
}