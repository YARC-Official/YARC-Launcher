import React from "react";
import styles from "./BaseDialog.module.css";
import { DialogManagerContext } from "../DialogProvider";

export abstract class BaseDialog<T> extends React.Component<Record<string, never>, T> {
    static contextType = DialogManagerContext;
    declare context: React.ContextType<typeof DialogManagerContext>;

    constructor(props: Record<string, never>) {
        super(props);
    }

    render() {
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