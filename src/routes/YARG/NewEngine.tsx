import LaunchPage from "@app/components/Launch/LaunchPage";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";
import DevYARGIcon from "@app/assets/DevYARGIcon.png";

function StableYARGPage() {
    const { data: releaseData, error, isSuccess, isLoading } = useYARGRelease("newEngine");
    const yargVersion = useYARGVersion(releaseData, "newEngine");

    if(isSuccess) {
        return (<>
            <LaunchPage 
                version={yargVersion} 
                releaseTag={releaseData?.tag_name} 
                playName="NEW ENGINE" 
                description={<>
                    This is the YARG v0.12 test channel! v0.12 is a massive update that will completely revamp the hit
                    engine, add profiles, add practice mode, add replays, and a lot more!
                    <strong>
                        This version does not represent the final product of v0.12, and is incomplete. Expect lots of bugs
                        and incomplete features.
                    </strong>
                </>}
                websiteUrl="https://github.com/YARC-Official/YARG-NewEngine" 
                icon={DevYARGIcon} 
            />
        </>);
    }
}

export default StableYARGPage;