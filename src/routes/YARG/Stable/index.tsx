import MainButton from "@app/components/MainButton";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { YARGStates, useYARGVersion } from "@app/hooks/useYARGVersion";

function StableYARGPage() {
    const releaseData = useYARGRelease("stable");
    const yargVersion = useYARGVersion(releaseData);
    const { state } = yargVersion;

    return (<>

        <h1>YARG stable version page</h1>
        <p>this page is on /src/routes/YARG/stable/index.tsx</p>

        <p>STATE: {

            // I SWEAR THIS IS ONLY FOR DEVELOPMENT
            // I believe you too
            state === YARGStates.AVAILABLE ? "Available to play" :
                state === YARGStates.DOWNLOADING ? "Downloading new version" :
                    state === YARGStates.ERROR ? "Error! Please check the DevTools log" :
                        state === YARGStates.LOADING ? "Loading latest release information" :
                            state === YARGStates.NEW_UPDATE ? "New update available!" :
                                state === YARGStates.PLAYING ? "YARGING" :
                                    "State not defined."

        }</p>

        <p>Current version: {releaseData?.tag_name}</p>

        <MainButton version={yargVersion} />
    </>);
}

export default StableYARGPage;