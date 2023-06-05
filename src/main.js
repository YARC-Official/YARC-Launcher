const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;

let greetInputEl;
let greetMsgEl;

// https://github.com/YARC-Official/YARG/releases/download/v0.10.5/YARG_v0.10.5-Windows-x64.zip
// 

async function greet() {
	// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
	try {
		greetMsgEl.textContent = await invoke("download");
	} catch (e) {
		greetMsgEl.textContent = "FAILED: " + e;
	}
}

function init() {
	greetInputEl = document.querySelector("#greet-input");
	greetMsgEl = document.querySelector("#greet-msg");
	document.querySelector("#greet-form").addEventListener("submit", (e) => {
		e.preventDefault();
		greet();
	});

	document
		.getElementById("titlebar-minimize")
		.addEventListener("click", () => appWindow.minimize());
	document
		.getElementById("titlebar-maximize")
		.addEventListener("click", () => appWindow.toggleMaximize());
	document
		.getElementById("titlebar-close")
		.addEventListener("click", () => appWindow.close())
}

window.addEventListener("DOMContentLoaded", init);