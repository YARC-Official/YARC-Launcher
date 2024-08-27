import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { closeDialog } from "..";

export class ChangeDownloadLocationDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                In order to change the download location of your applications and setlists, <strong>everything must
                first be uninstalled, and then reinstalled into the new location.</strong> Save data will not be lost.
            </p>
        </>;
    }

    getTitle() {
        return <>Warning</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.LIGHT} rounded onClick={() => closeDialog()}>
                Cancel
            </Button>
            <Button color={ButtonColor.RED} rounded onClick={() => closeDialog("continue")}>
                Continue
            </Button>
        </>;
    }
}
