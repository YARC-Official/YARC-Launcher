import { useState } from "react";
import styles from "./Onboarding.module.css";
import { useProfileStore } from "@app/stores/ProfileStore";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { settingsManager } from "@app/settings";
import OnboardingSidebar from "./Sidebar";
import Button from "../Button";
import InstallFolderPage from "./Pages/InstallFolderPage";
import ComponentsPage from "./Pages/ComponentsPage";

export enum OnboardingStep {
    // LANGUAGE = 0,
    INSTALL_PATH = 1,
    COMPONENTS = 2,
}

interface Props {
    setOnboarding: React.Dispatch<boolean>;
}

const Onboarding: React.FC<Props> = (props: Props) => {
    const [step, setStep] = useState<OnboardingStep>(OnboardingStep.INSTALL_PATH);

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
            <div className={styles.content}>
                <div className={styles.contentContainer}>
                    <div className={styles.stepContainer}>
                        {step === OnboardingStep.INSTALL_PATH &&
                            <InstallFolderPage
                                downloadLocation={downloadLocation}
                                downloadEmpty={downloadEmpty}
                                askForFolder={askForFolder} />
                        }
                        {step === OnboardingStep.COMPONENTS &&
                            <ComponentsPage />
                        }
                    </div>
                    <div className={styles.stepNavigation}>
                        <div className={styles.stepNavigationButtons}>
                            <Button onClick={() => {
                                if (step > OnboardingStep.INSTALL_PATH) {
                                    setStep(step - 1);
                                }
                            }}>
                                Back
                            </Button>
                            <Button onClick={() => {
                                switch (step) {
                                    case OnboardingStep.INSTALL_PATH:
                                        if (downloadEmpty) {
                                            setStep(step + 1);
                                        }
                                        break;
                                    case OnboardingStep.COMPONENTS:
                                        finish();
                                }
                            }}>
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>;
};

export default Onboarding;

