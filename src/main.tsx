import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import TitleBar from "./components/TitleBar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <App />
  </React.StrictMode>
);
