import { useYARGRelease } from "@app/hooks/useReleases";
import BaseVersion from "./Base";
import NightlyYARGIcon from '@app/assets/NightlyYARGIcon.png';
import { Link } from "react-router-dom";

const NightlyYARGVersion: React.FC = () => {
    const releaseData = useYARGRelease("nightly");

    return (
        <Link to="/yarg/nightly">
            <BaseVersion
                icon={<img src={NightlyYARGIcon} alt="YARG" />}
                programName="YARG"
                versionChannel="Nightly"
                version={releaseData?.tag_name}
                updateAvailable={true}
            />
        </Link>
    );
}

export default NightlyYARGVersion;