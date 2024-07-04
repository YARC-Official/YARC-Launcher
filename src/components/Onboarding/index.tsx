import { useState } from "react";
import styles from "./Onboarding.module.css";
import { useProfileStore } from "@app/stores/ProfileStore";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { settingsManager } from "@app/settings";

interface Props {
    setOnboarding: React.Dispatch<boolean>;
}

const Onboarding: React.FC<Props> = (props: Props) => {
    const profileStore = useProfileStore();

    const defaultDownload = profileStore.importantDirs?.yarcFolder;
    if (defaultDownload === undefined) {
        throw new Error("The default installation path was not found!");
    }

    const [downloadLocation, setDownloadLocation] = useState<string>(defaultDownload);
    const [downloadEmpty, setDownloadEmpty] = useState<boolean>(true);

    async function askForFolder() {
        const select = await open({
            directory: true
        });

        if (typeof select === "string") {
            const path: string = select;
            const empty: boolean = await invoke("is_dir_empty", { path: path });

            setDownloadLocation(path);
            setDownloadEmpty(empty);
        }
    }

    async function finish() {
        settingsManager.setCache("downloadLocation", downloadLocation);
        settingsManager.setCache("onboardingCompleted", true);
        await settingsManager.syncCache();

        props.setOnboarding(false);
    }

    return <div className={styles.container}>
        <div>
            Pick an installation folder:
        </div>
        <button onClick={() => askForFolder()}>
            { downloadLocation === null ? "Loading..." : downloadLocation }
        </button>
        {!downloadEmpty &&
            <div>
                Install path is not empty!
            </div>
        }
        <br/>
        <button onClick={() => finish()}>
            Done
        </button>
    </div>;
};

export default Onboarding;

