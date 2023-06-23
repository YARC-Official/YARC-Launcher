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
            state === YARGStates.AVAILABLE ? "Available to play" : // eslint-disable-next-line indent
            state === YARGStates.DOWNLOADING ? "Downloading new version" : // eslint-disable-next-line indent
            state === YARGStates.ERROR ? "Error! Please check the DevTools log" : // eslint-disable-next-line indent
            state === YARGStates.LOADING ? "Loading latest release information" :  // eslint-disable-next-line indent
            state === YARGStates.NEW_UPDATE ? "New update available!" : // eslint-disable-next-line indent
            state === YARGStates.PLAYING ? "YARGING" : // eslint-disable-next-line indent
            "State not defined." // eslint-disable-next-line indent
        
        }</p>

        <p>Current version: {releaseData?.tag_name}</p>

        {
            releaseData ? <button onClick={() => play()}>Play YARG nightly {releaseData?.tag_name}</button> : ""
        }

        <div>
            <button onClick={() => download()}>
                {
                    payload?.state === "waiting" ? "On queue" : // eslint-disable-next-line indent
                    payload?.state === "downloading" ? `Downloading... (${payload.current}/${payload.total})` : // eslint-disable-next-line indent
                    payload?.state === "installing" ? "Installing..." : // eslint-disable-next-line indent
                    "Download release"
                }
            </button>
        </div>

    </>);
}

export default NightlyYARGPage;