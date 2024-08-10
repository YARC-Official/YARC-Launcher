import styles from "./ErrorScreen.module.css";
import { error as LogError } from "tauri-plugin-log-api";
import { FallbackProps } from "react-error-boundary";
import { appWindow } from "@tauri-apps/api/window";

export function ErrorScreen({error}: FallbackProps) {
    return <div className={styles.error}>
        <p>
            An error has occurred.
            Please report this to our Discord or GitHub.
        </p>
        <code>
            {error && error.message}
        </code>
        <div className={styles.closeButton} onClick={() => appWindow.close()}>Close Launcher</div>
    </div>;
}

export function onError(error: Error) {
    LogError(`${error}`);
}
