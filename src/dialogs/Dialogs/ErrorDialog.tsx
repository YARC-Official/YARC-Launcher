import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import styles from "./ErrorDialog.module.css";

export class ErrorDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    getInnerContents() {
        return <>
            <p>
                A fatal error has occured. If you don&apos;t know what happened, please report this to our Discord
                or GitHub immediately. Make sure to send the below text:
            </p>
            <div className={styles.stacktrace}>
                {this.props.error as string}
            </div>
        </>;
    }

    getTitle() {
        return <>Fatal Error</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GRAY} onClick={() => this.context.closeDialog()}>Okay</Button>
        </>;
    }
}