import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { closeDialog } from "..";

export class OldVersionDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                <strong>You are trying to select an old version of YARG!</strong>
                &#32;These versions may be missing features, contain bugs and potentially corrupt your game data. Use at your own risk!
            </p>
        </>;
    }

    getTitle() {
        return <>Old Application Version</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.RED} rounded onClick={() => closeDialog("cancel")}>
                Cancel
            </Button>
            <Button color={ButtonColor.GREEN} rounded onClick={() => closeDialog("okay")}>
                Okay
            </Button>
        </>;
    }
}
