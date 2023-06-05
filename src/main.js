const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;

async function download() {
	try {
		let i = await invoke("download");
	} catch (e) {
		let i = "FAILED: " + e;
	}
}

function init() {
	// Set title bar actions
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