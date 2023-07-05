import { DialogManager } from "..";
import styles from "./BaseDialog.module.css";

export abstract class BaseDialog {
    protected dialogManager?: DialogManager = undefined;

    render(dialogManager: DialogManager) {
        this.dialogManager = dialogManager;

        return <>
            <div className={styles.title}>
                {this.getTitle()}
            </div>

            {this.getInnerContents()}

            <div className={styles.buttons}>
                {this.getButtons()}
            </div>
        </>;
    }

    protected abstract getTitle(): JSX.Element;
    protected abstract getInnerContents(): JSX.Element;
    protected abstract getButtons(): JSX.Element;
}