import LaunchPage from "@app/components/Launch/LaunchPage";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";
import NightlyYARGIcon from "@app/assets/NightlyYARGIcon.png";

function NightlyYARGPage() {
    const { data: releaseData, error, isSuccess, isLoading } = useYARGRelease("nightly");
    const yargVersion = useYARGVersion(releaseData, "nightly");

    if (isLoading) return "Loading...";

    if (error) return `An error has occurred: ${error}`;

    if(isSuccess) {
        return (<>
            <LaunchPage 
                version={yargVersion} 
                releaseTag={releaseData?.tag_name} 
                playName="NIGHTLY" 
                description={<>
                    YARG Nightly (a.k.a. YARG bleeding-edge) is an alternative version of YARG that is updated twice
                    a day (if changes have been made). These builds are in an extremely early beta, so bugs are expected.
                    If you do notice a bug, please be sure to report it on GitHub, or on our Discord.
                </>} 
                websiteUrl="https://github.com/YARC-Official/YARG-BleedingEdge" 
                icon={NightlyYARGIcon} 
            />
        </>);
    }
}

export default NightlyYARGPage;