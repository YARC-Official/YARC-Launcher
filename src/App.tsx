import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

function App() {
  const [downloadMsg, setDownloadMsg] = useState("");

  async function download() {
    try {
      setDownloadMsg(await invoke("download", {url: "https://github.com/YARC-Official/YARG/releases/download/v0.10.5/YARG_v0.10.5-Windows-x64.zip"}));
    } catch (e) {
      setDownloadMsg(`FAILED: ${e}`);
    }
  }

  return (
    <div className="container">
      <h1>Welcome to YAL!</h1>

      <button onClick={() => download()}>Download command</button>
      <p>{downloadMsg}</p>

    </div>
  );
}

export default App;
