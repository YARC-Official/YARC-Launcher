import { useState } from "react";
import styles from "./Onboarding.module.css";
import { useProfileStore } from "@app/stores/ProfileStore";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { settingsManager } from "@app/settings";
import OnboardingSidebar from "./Sidebar";

export enum OnboardingStep {
    LANGUAGE = 0,
    INSTALL_PATH = 1,
    COMPONENTS = 2,
}

interface Props {
    setOnboarding: React.Dispatch<boolean>;
}

const Onboarding: React.FC<Props> = (props: Props) => {
    const [step, setStep] = useState<OnboardingStep>(OnboardingStep.LANGUAGE);

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

        await profileStore.setDirs(downloadLocation);
        props.setOnboarding(false);
    }

    return <main className={styles.mainContainer}>
        <div className={styles.container}>
            <OnboardingSidebar onboardingStep={step} />
        </div>
    </main>;
};

export default Onboarding;

