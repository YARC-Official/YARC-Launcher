import Button, { ButtonColor } from "@app/components/Button";
import styles from "./AppSettings.module.css";
import { useEffect, useState } from "react";
import { ActiveProfile, GraphicsApi, VersionInfoList, VersionList } from "@app/profiles/types";
import { localizeMetadata } from "@app/profiles/utils";
import { tryFetchVersion, useProfileStore } from "@app/profiles/store";
import InputBox from "@app/components/InputBox";
import * as Tabs from "@radix-ui/react-tabs";
import { useOfflineStatus } from "@app/hooks/useOfflineStatus";
import { useQuery } from "@tanstack/react-query";
import { createAndShowDialog, showErrorDialog } from "@app/dialogs";
import { distanceFromToday } from "@app/utils/timeFormat";
import { OldVersionDialog } from "@app/dialogs/Dialogs/OldVersionDialog";
import { OS, getOS } from "@app/utils/os";

interface VersionListProps {
    activeProfile: ActiveProfile,

    selectedVersion?: string,
    setSelectedVersion: React.Dispatch<React.SetStateAction<string | undefined>>
}

const VersionListComp: React.FC<VersionListProps> = ({ activeProfile, selectedVersion, setSelectedVersion }: VersionListProps) => {
    const offlineStatus = useOfflineStatus();

    const versionListQuery = useQuery({
        enabled: activeProfile.profile.version.type === "list" && !offlineStatus.isOffline,
        queryKey: ["VersionList", activeProfile.profile.uuid],
        queryFn: async (): Promise<VersionList> =>
            await fetch((activeProfile.profile.version as VersionInfoList).listUrl)
                .then(res => res.json())
    });

    const selectVersion = async (uuid: string, index: number) => {
        if (index !== 0) {
            const versionDialogOutput = await createAndShowDialog(OldVersionDialog);

            if (versionDialogOutput === "okay") {
                setSelectedVersion(uuid);
            }
        } else {
            setSelectedVersion(uuid);
        }
    };

    if (versionListQuery.isLoading) {
        return <span className={styles.centered}>
            Loading...
        </span>;
    }

    const versionList = versionListQuery.data;
    if (versionListQuery.isError || versionList === undefined) {
        showErrorDialog(versionListQuery.error);
        return <span className={styles.centered}>
            Error
        </span>;
    }

    if (offlineStatus.isOffline) {
        return <span className={styles.centered}>
            Offline
        </span>;
    } else if (activeProfile.profile.version.type !== "list") {
        return <span className={styles.centered}>
            No version options for this profile...
        </span>;
    } else {
        return <>
            <div
                data-state={selectedVersion === undefined ? "active" : "inactive"}
                onClick={() => setSelectedVersion(undefined)}>

                <header>Latest Release ({versionList.length > 0 ? versionList[0].tag : ""})</header>
                <div>Recommended</div>
            </div>
            {
                versionList.map((i, index) =>
                    <div
                        data-state={selectedVersion === i.uuid ? "active" : "inactive"}
                        key={i.uuid}
                        onClick={async () => await selectVersion(i.uuid, index)}>

                        <header>{i.tag}</header>
                        <div>{distanceFromToday(i.release)}</div>
                    </div>
                )
            }
        </>;
    }
};

interface Props {
    activeProfile: ActiveProfile,
    setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppSettings: React.FC<Props> = ({ activeProfile, setSettingsOpen }: Props) => {
    let initalDisplayName = activeProfile.displayName;
    if (initalDisplayName === undefined) {
        initalDisplayName = localizeMetadata(activeProfile.profile, "en-US").name;
    }

    const [os, setOs] = useState<OS | undefined>();
    useEffect(() => {
        (async () => {
            setOs(await getOS());
        })();
    });

    const [displayName, setDisplayName] = useState<string>(initalDisplayName);
    const [launchArguments, setLaunchArguments] = useState<string>(activeProfile.launchArguments);
    const [obsVkcapture, setObsVkcapture] = useState<boolean>(activeProfile.useObsVkcapture);
    const [graphicsApi, setGraphicsApi] = useState<GraphicsApi>(activeProfile.graphicsApi);
    const [selectedVerison, setSelectedVersion] = useState<string | undefined>(activeProfile.selectedVersion);

    return <div className={styles.popup}>
        <div className={styles.body}>
            <Tabs.Root className={styles.tabRoot} defaultValue="settings">
                <Tabs.List className={styles.tabList}>
                    <Tabs.Trigger className={styles.tab} value="settings">
                        Settings
                    </Tabs.Trigger>
                    <Tabs.Trigger className={styles.tab} value="version">
                        Version
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className={styles.content} value="settings">
                    <div className={styles.setting}>
                        <p>Display Name</p>
                        <InputBox state={displayName} setState={setDisplayName} placeholder="Display name..." />
                    </div>
                    <div className={styles.setting}>
                        <p>Additional Launch Arguments</p>
                        <InputBox state={launchArguments} setState={setLaunchArguments} placeholder="Launch arguments..." />
                    </div>
                    {os === "linux" &&
                        <div className={[styles.setting, styles.wide].join(" ")}>
                            <p>Use obs-vkcapture wrapper (you need to have it installed)</p>
                            {obsVkcapture &&
                                <Button color={ButtonColor.GREEN} rounded border
                                    onClick={() => setObsVkcapture(false)}>

                                    Enabled
                                </Button>
                            }
                            {!obsVkcapture &&
                                <Button color={ButtonColor.LIGHT} rounded
                                    onClick={() => setObsVkcapture(true)}>

                                    Disabled
                                </Button>
                            }
                        </div>
                    }
                    <div className={styles.setting}>
                        <p>Graphics API</p>
                        <select defaultValue={graphicsApi} onChange={(e) => setGraphicsApi(e.target.value as GraphicsApi)}>
                            <option value={GraphicsApi.Default}>Default</option>
                            { (os === "windows" &&
                                <>
                                    <option value={GraphicsApi.D3D11}>DirectX 11</option>
                                    <option value={GraphicsApi.D3D12}>DirectX 12</option>
                                    <option value={GraphicsApi.OPEN_GL}>OpenGL</option>
                                    <option value={GraphicsApi.VULKAN}>Vulkan</option>
                                </>)
                                || (os === "macos" &&
                                <>
                                    <option value={GraphicsApi.METAL}>Metal</option>
                                    <option value={GraphicsApi.VULKAN}>Vulkan</option>
                                </>)
                                || (os === "linux" &&
                                <>
                                    <option value={GraphicsApi.OPEN_GL}>OpenGL</option>
                                    <option value={GraphicsApi.VULKAN}>Vulkan</option>
                                </>)
                            }
                        </select>
                    </div>
                </Tabs.Content>
                <Tabs.Content className={styles.versionList} value="version">
                    <VersionListComp
                        activeProfile={activeProfile}
                        selectedVersion={selectedVerison}
                        setSelectedVersion={setSelectedVersion} />
                </Tabs.Content>
            </Tabs.Root>
            <div className={styles.navigation}>
                <Button color={ButtonColor.LIGHT} rounded
                    onClick={() => setSettingsOpen(false)}>
                    Discard Changes
                </Button>
                <Button color={ButtonColor.GREEN} rounded border
                    onClick={async () => {
                        // Update display name
                        if (displayName !== initalDisplayName) {
                            activeProfile.displayName = displayName;
                        }

                        // Update other fields
                        activeProfile.launchArguments = launchArguments;
                        activeProfile.useObsVkcapture = obsVkcapture;

                        // Update graphics api
                        activeProfile.graphicsApi = graphicsApi;

                        // Update profile version
                        if (selectedVerison !== activeProfile.selectedVersion) {
                            activeProfile.selectedVersion = selectedVerison;

                            const newVersion = await tryFetchVersion(activeProfile.profile, activeProfile.selectedVersion);
                            if (newVersion !== undefined) {
                                activeProfile.version = newVersion;
                            }

                            console.log(activeProfile);
                        }

                        useProfileStore.getState().updateProfile(activeProfile);

                        setSettingsOpen(false);
                    }}>
                    Save
                </Button>
            </div>
        </div>
    </div>;
};

export default AppSettings;
