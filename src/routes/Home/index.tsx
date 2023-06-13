import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [downloadMsg, setDownloadMsg] = useState("");

  async function download() {
    try {
      setDownloadMsg("Loading...");
      await invoke("download_yarg", {
        zipUrl: "https://github.com/EliteAsian123/YARG/releases/download/v0.10.6/YARG_v0.10.6-Windows-x64.zip",
        versionId: "v0.10.6"
      });
      setDownloadMsg("Done!");
    } catch (e) {
      setDownloadMsg(`FAILED: ${e}`);
    }
  }

  async function play() {
    try {
      setDownloadMsg("Launching...");
      await invoke("play_yarg", {
        versionId: "v0.10.6"
      });
      setDownloadMsg("Done!");
    } catch (e) {
      setDownloadMsg(`FAILED: ${e}`);
    }
  }

  async function checkInstalled() {
    try {
      let installed = await invoke("version_exists_yarg", {
        versionId: "v0.10.6"
      });
      setDownloadMsg(installed ? "Installed!" : "Not installed...");
    } catch (e) {
      setDownloadMsg(`FAILED: ${e}`);
    }
  }

  async function getOs() {
    // Can return:
    // "windows"
    // "macos"
    // "linux"
    let os = await invoke("get_os") as string;
    setDownloadMsg(os);
  }

  return (
    <div className="container">
      <h1>Welcome to YAL!</h1>

      <button onClick={() => download()}>Download command</button>
      <button onClick={() => play()}>Play command</button>
      <button onClick={() => checkInstalled()}>Check installed command</button>
      <button onClick={() => getOs()}>Get OS command</button>
      <p>{downloadMsg}</p>

    </div>
  );
}

export default App;