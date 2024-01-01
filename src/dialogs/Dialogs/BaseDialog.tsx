import React from "react";
import styles from "./BaseDialog.module.css";

export abstract class BaseDialog<T> extends React.Component<Record<string, unknown>, T> {
    constructor(props: Record<string, unknown>) {
        super(props);
    }

    render() {
        return <>
            <div className={styles.title}>
                {this.getTitle()}
            </div>

            <div className={styles.contents}>
                {this.getInnerContents()}
            </div>

            <div className={styles.buttons}>
                {this.getButtons()}
            </div>
        </>;
    }

    protected abstract getTitle(): JSX.Element;
    protected abstract getInnerContents(): JSX.Element;
    protected abstract getButtons(): JSX.Element;
}