import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { closeDialog } from "..";

export class UninstallBeforeDeleteDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                Before you delete the profile, <strong>you must first uninstall the application/setlist</strong>.
                Although, you can always add the profile back in the future, <strong>this cannot be undone
                and all profile settings will be deleted</strong> (application data will remain untouched).
            </p>
        </>;
    }

    getTitle() {
        return <>Cannot Delete Profile</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GREEN} rounded onClick={() => closeDialog()}>
                I Understand
            </Button>
        </>;
    }
}
