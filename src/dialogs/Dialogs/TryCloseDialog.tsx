import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";

export class TryCloseDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                You cannot close the launcher while something is downloading.
                <strong> Force closing may corrupt your install!</strong>
            </p>
        </>;
    }

    getTitle() {
        return <>Cannot Close</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GREEN} onClick={() => this.context.closeDialog()}>Don&apos;t Close</Button>
            <Button color={ButtonColor.YELLOW} onClick={() => this.context.closeDialog("close")}>
                <strong>Force Close</strong>
            </Button>
        </>;
    }
}