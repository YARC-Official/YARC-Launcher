import { appWindow } from "@tauri-apps/api/window";

import styles from "./titlebar.module.css";
import { ReactComponent as MinimizeIcon } from "@app/assets/Minimize.svg";
import { ReactComponent as CloseIcon } from "@app/assets/Close.svg";

const TitleBar: React.FC = () => {
    return <div data-tauri-drag-region className={styles.title_bar}>
        <div className={styles.text}>
            <span>YAL</span>
            <span>Yet Another Launcher</span>
        </div>

        <div className={styles.buttons}>
            <div onClick={() => appWindow.minimize()} className={styles.button}>
                <MinimizeIcon />
            </div>

            <div onClick={() => appWindow.close()} className={styles.button}>
                <CloseIcon />
            </div>
        </div>
    </div>;
}

export default TitleBar;