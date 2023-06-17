import { useYARGRelease } from "@app/hooks/useReleases";
import BaseVersion from "./Base";
import NightlyYARGIcon from "@app/assets/NightlyYARGIcon.png";
import StableYARGIcon from "@app/assets/StableYARGIcon.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";

interface Props {
    channel: "stable" | "nightly";
}

const YARGVersion: React.FC<Props> = ({ channel }: Props) => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const releaseData = useYARGRelease(channel);

    useEffect(() => {
        (async () => {
            if (releaseData == null) {
                return;
            }

            const exists = await invoke("version_exists_yarg", {
                versionId: releaseData.tag_name
            });

            setUpdateAvailable(!exists);
        })();
    }, [releaseData]);

    function getChannelIcon() {
        switch (channel) {
            case "stable":
                return StableYARGIcon;
            case "nightly":
                return NightlyYARGIcon;
        }
    }

    function getChannelDisplayName() {
        switch (channel) {
            case "stable":
                return "Stable";
            case "nightly":
                return "Nightly";
        }
    }

    return (
        <Link to={"/yarg/" + channel}>
            <BaseVersion
                icon={<img src={getChannelIcon()} alt="YARG" />}
                programName="YARG"
                versionChannel={getChannelDisplayName()}
                version={releaseData?.tag_name}
                updateAvailable={updateAvailable}
            />
        </Link>
    );
};

export default YARGVersion;