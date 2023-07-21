import Button, { ButtonColor } from "@app/components/Button";
import { BaseDialog } from "./BaseDialog";
import { open } from "@tauri-apps/api/dialog";
import styles from "./InstallFolderDialog.module.css";
import { DriveIcon, WarningIcon } from "@app/assets/Icons";
import { invoke } from "@tauri-apps/api";

interface State {
    path?: string;
    empty: boolean;
}

export class InstallFolderDialog extends BaseDialog<State> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            path: undefined,
            empty: true
        };

        // Load the default path
        (async () => {
            const path = await invoke("get_download_location") as string;
            this.setState(() => ({
                path: path,
                empty: true
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
            {!this.state.empty ?
                <div className={styles.warning_box}>
                    <WarningIcon /> The folder selected is not empty! Make sure it doesn&apos;t have any files in it.
                </div>
                : ""
            }
        </>;
    }

    private async askForFolder() {
        const select = await open({
            directory: true
        });

        if (typeof select === "string") {
            const path: string = select;
            const empty: boolean = await invoke("is_dir_empty", { path: path });

            this.setState(() => ({
                path: path,
                empty: empty
            }));
        }
    }

    getTitle() {
        return <>Install Folder</>;
    }

    getButtons() {
        return <>
            <Button color={ButtonColor.GRAY} onClick={() => this.context.closeDialog("cancel")}>Cancel</Button>
            <Button color={ButtonColor.GREEN} onClick={() => {
                if (!this.state.empty) {
                    return;
                }

                this.context.closeDialog(this.state.path);
            }}>Okay</Button>
        </>;
    }
}