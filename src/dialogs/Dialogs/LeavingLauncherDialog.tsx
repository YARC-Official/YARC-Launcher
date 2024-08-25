import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { closeDialog } from "..";
import styles from "./BaseDialog.module.css";
import { openUrl } from "@app/utils/safeUrl";

export class LeavingLauncherDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                This link is taking you to the following website. Make sure you trust it before going to there!
            </p>
            <div className={styles.box}>
                {this.props.url as string}
            </div>
        </>;
    }

    getTitle() {
        return <>Leaving Launcher</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.LIGHT} rounded onClick={() => closeDialog()}>
                Go Back
            </Button>
            <Button color={ButtonColor.GREEN} rounded onClick={() => {
                openUrl(this.props.url as string);
                closeDialog();
            }}>
                Visit Site
            </Button>
        </>;
    }
}
