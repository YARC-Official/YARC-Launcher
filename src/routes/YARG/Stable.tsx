import LaunchPage from "@app/components/Launch/LaunchPage";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";
import StableYARGIcon from "@app/assets/StableYARGIcon.png";

function StableYARGPage() {
    const { data: releaseData, error, isSuccess, isLoading } = useYARGRelease("stable");
    const yargVersion = useYARGVersion(releaseData, "stable");

    if (isLoading) return "Loading...";

    if (error) return `An error has occurred: ${error}`;

    if(isSuccess) {
        return (<>
            <LaunchPage 
                version={yargVersion} 
                releaseTag={releaseData?.tag_name} 
                playName="STABLE" 
                description={<>
                    YARG (a.k.a. Yet Another Rhythm Game) is a free, open-source, plastic guitar game that is
                    still in development. It supports guitar (five fret), drums (plastic or e-kit), vocals,
                    pro-guitar, and more!
                </>} 
                websiteUrl="https://github.com/YARC-Official/YARG" 
                icon={StableYARGIcon} 
                banner="/src/assets/Banner/Stable.png"
            />
        </>);
    }
}

export default StableYARGPage;