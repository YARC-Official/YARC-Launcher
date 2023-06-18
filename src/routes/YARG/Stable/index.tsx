import { useYARGRelease } from "@app/hooks/useReleases";
import { YARGStates, useYARGVersion } from "@app/hooks/useYARGVersion";
import { useDownloadPayload } from "@app/stores/DownloadStore";

function StableYARGPage() {
    const releaseData = useYARGRelease("stable");
    const { state, play, download } = useYARGVersion(releaseData);
    const { payload } = useDownloadPayload(releaseData.tag_name);

    return (<>

        <h1>YARG stable version page</h1>
        <p>this page is on /src/routes/YARG/stable/index.tsx</p>

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
            releaseData ? <button onClick={() => play()}>Play YARG stable {releaseData?.tag_name}</button> : ""
        }

        <div>
            <button onClick={() => download()}>Download Release { payload ? `(${payload.current}/${payload.total})` : "" }</button>
        </div>

    </>);
}

export default StableYARGPage;