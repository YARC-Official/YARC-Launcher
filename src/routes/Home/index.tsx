import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
    const [downloadMsg, setDownloadMsg] = useState("");

    async function download() {
        /*
        
        TODO: Tie this to the front-end!

        You can get the data for the latest release here:
        https://raw.githubusercontent.com/YARC-Official/Official-Setlist-Public/master/setlists/official.json
        Let's call this data `SetlistData`

        The downloading process *also* uses the `progress_info` emission.
        
        */

        try {
            setDownloadMsg("Loading...");
            await invoke("download_setlist", {
                zipUrls: [ // SetlistData.downloads
                    "https://github.com/YARC-Official/Official-Setlist-Public/releases/download/official-2023-06-17-0/official_0.7z",
                    "https://github.com/YARC-Official/Official-Setlist-Public/releases/download/official-2023-06-17-0/official_1.7z"
                ],
                id: "official", // SetlistData.id
                version: "2023-06-17-0" // SetlistData.version
            });
            setDownloadMsg("Done!");
        } catch (e) {
            setDownloadMsg(`FAILED: ${e}`);
        }
    }

    async function checkInstalled() {
        try {
            const installed = await invoke("version_exists_setlist", {
                id: "official", // SetlistData.id
                version: "2023-06-17-0" // SetlistData.version
            });
            setDownloadMsg(installed ? "Installed!" : "Not installed...");
        } catch (e) {
            setDownloadMsg(`FAILED: ${e}`);
        }
    }

    async function showAlert() {
        await invoke("open_alert_window", {
            errorString: "ISSUE!"
        });
    }

    return (
        <div className="container">
            <h1>Welcome to YAL!</h1>

            <button onClick={() => download()}>Download Setlist</button>
            <button onClick={() => checkInstalled()}>Check Setlist Installed</button>
            <button onClick={() => showAlert()}>Open Alert Window</button>
            <p>{downloadMsg}</p>

        </div>
    );
}

export default App;