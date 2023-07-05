import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { open } from "@tauri-apps/api/dialog";
import styles from "./InstallFolderDialog.module.css";
import { DriveIcon } from "@app/assets/Icons";
import { invoke } from "@tauri-apps/api";

interface State {
    path?: string;
}

export class InstallFolderDialog extends BaseDialog<State> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            path: undefined
        };

        // Load the default path
        (async () => {
            const path = await invoke("get_download_location") as string;
            this.setState(() => ({
                path: path
            }));
        })();
    }

    getInnerContents() {
        return <>
            <p>
                Please choose an installation folder. This folder should not be a folder that is synced with the cloud.
                If you do not know what folder to choose, just click &quot;Okay&quot;.
            </p>
            <div className={styles.folder_container} onClick={() => this.askForFolder()}>
                <div className={styles.folder_info}>
                    <DriveIcon />
                    {this.state.path ? this.state.path : "Loading..."}
                </div>
                <div className={styles.folder_extra}>

                </div>
            </div>
        </>;
    }

    private async askForFolder() {
        const select = await open({
            directory: true
        });

        if (typeof select === "string") {
            this.setState(() => ({
                path: select as string
            }));
        }
    }

    getTitle() {
        return <>Install Folder</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GRAY} onClick={() => this.context.closeDialog("cancel")}>Cancel</Button>
            <Button color={ButtonColor.GREEN} onClick={() => this.context.closeDialog(this.state.path)}>Okay</Button>
        </>;
    }
}