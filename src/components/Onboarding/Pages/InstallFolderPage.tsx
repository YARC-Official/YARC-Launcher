import styles from "./Pages.module.css";
import Button from "@app/components/Button";
import WarningBox from "./WarningBox";

interface Props {
    downloadLocation: string;
    downloadEmpty: boolean;

    askForFolder: () => Promise<void>;
}

export const InstallFolderPage: React.FC<Props> = (props: Props) => {
    return <>
        <WarningBox>
            The installation folder can be changed after initial setup,
            however some content may need to be re-downloaded.
        </WarningBox>
        <div className={styles.folderSelection}>
            <div className={styles.selectedFolder}>
                <p>{props.downloadLocation}</p>
            </div>
            <div className={styles.browseButtonContainer}>
                <Button onClick={async () => await props.askForFolder()}>
                    Browse
                </Button>
            </div>
        </div>
        {!props.downloadEmpty &&
            <WarningBox>
                The folder you selected is not empty. Please select an empty folder to continue.
            </WarningBox>
        }
    </>;
};

export default InstallFolderPage;
