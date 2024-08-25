import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import styles from "./BaseDialog.module.css";
import { error as LogError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";
import { closeDialog } from "..";

export class ErrorDialog extends BaseDialog<Record<string, never>> {
    constructor(props: Record<string, unknown>) {
        super(props);

        try {
            LogError(
                JSON.stringify(serializeError(props.error))
            );
        } catch (e) {
            console.error(e);
        }
    }

    getInnerContents() {
        let message: string;
        if (this.props.error instanceof Error) {
            message = JSON.stringify(serializeError(this.props.error));
        } else if (typeof this.props.error === "string") {
            message = this.props.error;
        } else {
            message = JSON.stringify(this.props.error);
        }

        return <>
            <p>
                A fatal error has occured. If this continues to happen, please report this to our Discord
                or GitHub immediately. Make sure to send the below text:
            </p>
            <div className={styles.box}>
                {message}
            </div>
        </>;
    }

    getTitle() {
        return <>Fatal Error</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.LIGHT} rounded onClick={() => closeDialog()}>Okay</Button>
        </>;
    }
}
