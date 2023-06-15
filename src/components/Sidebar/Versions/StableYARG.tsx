import { useYARGRelease } from "@app/hooks/useReleases";
import BaseVersion from "./Base";
import StableYARGIcon from '@app/assets/StableYARGIcon.png';
import { Link } from "react-router-dom";

const StableYARGVersion: React.FC = () => {
    const releaseData = useYARGRelease("stable");

    return (
        <Link to="/yarg/stable">
            <BaseVersion
                icon={<img src={StableYARGIcon} alt="YARG" />}
                programName="YARG"
                versionChannel="Stable"
                version={releaseData?.tag_name}
                updateAvailable={true}
            />
        </Link>
    );
}

export default StableYARGVersion;