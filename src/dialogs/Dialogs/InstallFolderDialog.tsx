import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";

export class InstallFolderDialog extends BaseDialog {
    getInnerContents() {
        return <>
            <p>
                Please choose an installation folder. This folder should not be a folder that is synced with the cloud.
                If you do not know what folder to choose, just click &quot;Okay&quot;.
            </p>
        </>;
    }

    getTitle() {
        return <>Install Folder</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GRAY} onClick={() => this.dialogManager?.closeDialog()}>Cancel</Button>
            <Button color={ButtonColor.GREEN}>Okay</Button>
        </>;
    }
}