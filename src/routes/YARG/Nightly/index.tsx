import PayloadProgress from "@app/components/PayloadProgress";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { YARGStates, useYARGVersion } from "@app/hooks/useYARGVersion";

function NightlyYARGPage() {
    const releaseData = useYARGRelease("nightly");
    const { state, play, download, payload } = useYARGVersion(releaseData);

    return (<>

        <h1>YARG nightly version page</h1>
        <p>this page is on /src/routes/YARG/nightly/index.tsx</p>

        <p>STATE: {

            // I SWEAR THIS IS ONLY FOR DEVELOPMENT
            // I believe you
            state === YARGStates.AVAILABLE ? "Available to play" :
                state === YARGStates.DOWNLOADING ? "Downloading new version" :
                    state === YARGStates.ERROR ? "Error! Please check the DevTools log" :
                        state === YARGStates.LOADING ? "Loading latest release information" :
                            state === YARGStates.NEW_UPDATE ? "New update available!" :
                                state === YARGStates.PLAYING ? "YARGING" :
                                    "State not defined."

        }</p>

        <p>Current version: {releaseData?.tag_name}</p>

        {
            releaseData ? <button onClick={() => play()}>Play YARG nightly {releaseData?.tag_name}</button> : ""
        }

        <div>
            <button onClick={() => download()}>
                <PayloadProgress payload={payload} defaultText="Download" />
            </button>
        </div>

    </>);
}

export default NightlyYARGPage;