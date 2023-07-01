import LaunchPage from "@app/components/LaunchPage/Index";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";

function StableYARGPage() {
    const releaseData = useYARGRelease("stable");
    const yargVersion = useYARGVersion(releaseData);

    return (<>
        <LaunchPage version={yargVersion} playName="STABLE" />
    </>);
}

export default StableYARGPage;