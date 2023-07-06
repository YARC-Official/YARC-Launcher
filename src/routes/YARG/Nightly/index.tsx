import LaunchPage from "@app/components/LaunchPage";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";

function NightlyYARGPage() {
    const releaseData = useYARGRelease("nightly");
    const yargVersion = useYARGVersion(releaseData, "nightly");

    return (<>
        <LaunchPage version={yargVersion} playName="NIGHTLY" />
    </>);
}

export default NightlyYARGPage;