import { useYARGRelease, getYARGReleaseZip } from "@app/hooks/useReleases";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

function NightlyYARGPage() {
    const [debugMsg, setDebugMsg] = useState("");
    const releaseData = useYARGRelease("nightly");

    async function download(version: string) {
        try {
            setDebugMsg("Loading...");

            // Get the zip url
            let zipUrl = await getYARGReleaseZip(releaseData);

            // Download it
            await invoke("download_yarg", {
                zipUrl: zipUrl,
                versionId: version
            });

            setDebugMsg("Done!");
        } catch (e) {
            setDebugMsg(`FAILED: ${e}`);
        }
    };

    async function play(version: string) {
        try {
            setDebugMsg("Loading...");

            await invoke("play_yarg", {
                versionId: version
            });

            setDebugMsg("Done!");
        } catch (e) {
            setDebugMsg(`FAILED: ${e}`);
        }
    }

    return (<>

        <h1>YARG nightly version page</h1>
        <p>this page is on /src/routes/YARG/nightly/index.tsx</p>

        <p>Debug message: {debugMsg}</p>

        <p>Current version: {releaseData?.tag_name}</p>

        {
            releaseData ? <button onClick={() => play(releaseData?.tag_name)}>Play YARG nightly {releaseData?.tag_name}</button> : ""
        }

        <div>
            <button onClick={() => download(releaseData.tag_name)}>Download Release</button>
        </div>

    </>);
}

export default NightlyYARGPage;