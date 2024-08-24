import { useState } from "react";
import styles from "./Onboarding.module.css";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { settingsManager } from "@app/settings";
import OnboardingSidebar from "./Sidebar";
import Button, { ButtonColor } from "../Button";
import InstallFolderPage from "./Pages/InstallFolderPage";
import ComponentsPage from "./Pages/ComponentsPage";
import { useDirectories } from "@app/profiles/directories";
import { useProfileStore } from "@app/profiles/store";
import { downloadAndInstall } from "@app/profiles/actions";
import { getPathForProfile } from "@app/profiles/utils";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";

export enum OnboardingStep {
    // LANGUAGE = 0,
    INSTALL_PATH = 1,
    COMPONENTS = 2,
}

interface Props {
    setOnboarding: React.Dispatch<boolean>;
}

const Onboarding: React.FC<Props> = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<OnboardingStep>(OnboardingStep.INSTALL_PATH);

    let directories = useDirectories();
    const offlineStatus = useOfflineStatus();

    const defaultDownload = directories.importantDirs?.yarcFolder;
    if (defaultDownload === undefined) {
        throw new Error("The default installation path was not found!");
    }

    const [downloadLocation, setDownloadLocation] = useState<string>(defaultDownload);
    const [downloadEmpty, setDownloadEmpty] = useState<boolean>(true);

    const [profileUrls, setProfileUrls] = useState<string[]>([]);

    if (offlineStatus.isOffline) {
        return <main className={styles.mainContainer}>
            <div className={styles.center}>
                <span>
                    You&apos;re offline! Please connect to the internet and restart the launcher to
                    finish the launcher onboarding process.
                </span>
            </div>
        </main>;
    }

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
        setLoading(true);

        settingsManager.setCache("downloadLocation", downloadLocation);
        settingsManager.setCache("onboardingCompleted", true);
        await settingsManager.syncCache();

        await directories.setDirs(downloadLocation);
        directories = useDirectories.getState();

        // If the user has old stuff installed, remove those
        try {
            await invoke("clean_up_old_install", {
                yargFolder: directories.customDirs?.yargFolder,
                setlistFolder: directories.customDirs?.setlistFolder
            });
        } catch {
            // Ignore
        }

        for (const url of profileUrls) {
            const uuid = await useProfileStore.getState().activateProfile(url);
            if (uuid === undefined) {
                continue;
            }

            const activeProfile = useProfileStore.getState().getProfileByUUID(uuid);
            if (activeProfile === undefined) {
                continue;
            }

            const path = await getPathForProfile(directories, activeProfile);
            await downloadAndInstall(activeProfile, path);
        }

        props.setOnboarding(false);
    }

    return <main className={styles.mainContainer}>
        {!loading &&
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
                                <ComponentsPage profileUrls={profileUrls} setProfileUrls={setProfileUrls} />
                            }
                        </div>
                        <div className={styles.stepNavigation}>
                            <div className={styles.stepNavigationButtons}>
                                <Button color={ButtonColor.DARK} border onClick={() => {
                                    if (step > OnboardingStep.INSTALL_PATH) {
                                        setStep(step - 1);
                                    }
                                }}>
                                    Back
                                </Button>
                                <Button color={ButtonColor.GREEN} border onClick={() => {
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
        }
        {loading &&
            <div className={styles.center}>
                <span>
                    Loading, please wait...
                </span>
            </div>
        }
    </main>;
};

export default Onboarding;

