import LaunchPage from "@app/components/LaunchPage/Index";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";

function NightlyYARGPage() {
    const releaseData = useYARGRelease("nightly");
    const yargVersion = useYARGVersion(releaseData);

    return (<>
        <LaunchPage version={yargVersion} playName="NIGHTLY" />
    </>);
}

export default NightlyYARGPage;