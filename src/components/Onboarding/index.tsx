import {useState} from "react";
import styles from "./Onboarding.module.css";
import {open} from "@tauri-apps/plugin-dialog";
import {invoke} from "@tauri-apps/api/core";
import {settingsManager} from "@app/settings";
import OnboardingSidebar from "./Sidebar";
import Button, {ButtonColor} from "../Button";
import InstallFolderPage from "./Pages/InstallFolderPage";
import ComponentsPage from "./Pages/ComponentsPage";
import {useDirectories} from "@app/profiles/directories";
import {useProfileStore} from "@app/profiles/store";
import {downloadAndInstall, promptDownloadMsvc} from "@app/profiles/actions";
import {getPathForProfile} from "@app/profiles/utils";
import {useOfflineStatus} from "@app/hooks/useOfflineStatus";
import {checkMsvc} from "@app/utils/checkMsvc";
import {TaskPayload} from "@app/tasks/payload";
import PayloadProgress from "@app/components/PayloadProgress";

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
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [msvcProgress, setMsvcProgress] = useState<TaskPayload | undefined>(undefined);

    const [downloadingMsvc, setDownloadingMsvc] = useState<boolean>(false);

    let directories = useDirectories();
    const offlineStatus = useOfflineStatus();

    const defaultDownload = directories.importantDirs?.yarcFolder;
    if (defaultDownload === undefined) {
        throw new Error("The default installation path was not found!");
    }

    const [downloadLocation, setDownloadLocation] = useState<string>(defaultDownload);
    const [downloadEmpty, setDownloadEmpty] = useState<boolean>(true);

    const [profileUrls, setProfileUrls] = useState<string[]>([]);

    // If the user is attempting to change the install path, they would have active profiles
    const hasActiveProfiles = settingsManager.getCache("activeProfiles").length > 0;
    let steps: OnboardingStep[];
    if (!hasActiveProfiles) {
        steps = [
            OnboardingStep.INSTALL_PATH,
            OnboardingStep.COMPONENTS
        ];
    } else {
        steps = [
            OnboardingStep.INSTALL_PATH
        ];
    }

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

    async function isMsvcNeeded() {
        return await checkMsvc();
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

        const msvcNeeded = await isMsvcNeeded();

        setLoading(true);

        if (msvcNeeded) {
            setDownloadingMsvc(true);
            const success = await promptDownloadMsvc((payload) => {
                setMsvcProgress(payload);
            });

            if (!success) {
                setLoading(false);
                setMsvcProgress(undefined);
            }

            setDownloadingMsvc(false);
        }

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

        if (!hasActiveProfiles) {
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
        }

        props.setOnboarding(false);
    }

    return <main className={styles.mainContainer}>
        {!loading &&
            <div className={styles.container}>
                <OnboardingSidebar steps={steps} stepIndex={stepIndex} />
                <div className={styles.content}>
                    <div className={styles.contentContainer}>
                        <div className={styles.stepContainer}>
                            {steps[stepIndex] === OnboardingStep.INSTALL_PATH &&
                                <InstallFolderPage
                                    downloadLocation={downloadLocation}
                                    downloadEmpty={downloadEmpty}
                                    askForFolder={askForFolder} />
                            }
                            {steps[stepIndex] === OnboardingStep.COMPONENTS &&
                                <ComponentsPage profileUrls={profileUrls} setProfileUrls={setProfileUrls} />
                            }
                        </div>
                        <div className={styles.stepNavigation}>
                            <div className={styles.stepNavigationButtons}>
                                <Button color={ButtonColor.DARK} border onClick={() => {
                                    if (stepIndex > 0) {
                                        setStepIndex(stepIndex - 1);
                                    }
                                }}>
                                    Back
                                </Button>
                                <Button color={ButtonColor.GREEN} border onClick={() => {
                                    if (stepIndex === steps.length - 1) {
                                        finish();
                                    } else {
                                        setStepIndex(stepIndex + 1);
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
                {msvcProgress !== undefined ? (
                    <span>Downloading MSVC Redistributable...
                        <PayloadProgress payload={msvcProgress} /></span>
                ) : downloadingMsvc ? (
                    <span>Installing MSVC Redistributable...<br />
                        This may take a while, so please don&apos;t close the launcher.
                    </span>
                ) : (
                    <span>
                        Loading, please wait...
                    </span>
                )}
            </div>
        }
    </main>;
};

export default Onboarding;

