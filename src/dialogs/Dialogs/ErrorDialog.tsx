import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import styles from "./ErrorDialog.module.css";
import { error as LogError } from "tauri-plugin-log-api";
import { serializeError } from "serialize-error";

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
        return <>
            <p>
                A fatal error has occured. If you don&apos;t know what happened, please report this to our Discord
                or GitHub immediately. Make sure to send the below text:
            </p>
            <div className={styles.stacktrace}>
                { this.props.error instanceof Error && "message" in this.props.error ? this.props.error.message as string : JSON.stringify(serializeError(this.props.error)) }
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