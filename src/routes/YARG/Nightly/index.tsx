import { useYARGRelease } from "@app/hooks/useReleases";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

function NightlyYARGPage() {
    const [debugMsg, setDebugMsg] = useState("");
    const { data } = useYARGRelease("nightly");

    async function download(version: string, zipUrl: string) {
        try {
            setDebugMsg("Loading...");
    
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

        <p>Current version: {data?.tag_name}</p>

        {
            data ? <button onClick={() => play(data?.tag_name)}>Play YARG nightly {data?.tag_name}</button> : ""
        }

        <div>
            <p>Download assets:</p>
            {
                data?.assets.map(asset => <button onClick={() => download(data.tag_name, asset.browser_download_url)}>{asset.name}</button>)
            }
        </div>

    </>);
}

export default NightlyYARGPage;