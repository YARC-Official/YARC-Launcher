// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;

use directories::BaseDirs;
use futures_util::lock::Mutex;
use minisign::{PublicKeyBox, SignatureBox};
use std::fs::{self, remove_file};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::{fs::File, io::Write};
use tauri::{AppHandle, Manager};
use utils::{clear_folder, download, extract, extract_setlist_part};
use window_shadows::set_shadow;

// TODO: Move this to a file or something
const YARG_PUB_KEY: &str = "untrusted comment: minisign public key C26EBBBEC4C1DB81
RWSB28HEvrtuwvPn3pweVBodgVi/d+UH22xDsL3K8VBgeRqaIrDdTvps
";

#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    pub state: String,
    pub total: u64,
    pub current: u64,
}

pub struct InnerState {
    pub yarc_folder: PathBuf,
    pub temp_folder: PathBuf,
    pub yarg_folder: PathBuf,
    pub setlist_folder: PathBuf,
}

impl InnerState {
    pub fn init(&mut self) -> Result<(), String> {
        let dirs = BaseDirs::new().ok_or("Failed to get directories.")?;

        self.yarc_folder = PathBuf::from(dirs.data_local_dir());
        self.yarc_folder.push("YARC");

        self.temp_folder = PathBuf::from(&self.yarc_folder);
        self.temp_folder.push("Launcher");
        self.temp_folder.push("Temp");

        self.yarg_folder = PathBuf::from(&self.yarc_folder);
        self.yarg_folder.push("YARG Installs");

        self.setlist_folder = PathBuf::from(&self.yarc_folder);
        self.setlist_folder.push("Setlists");

        // Delete everything temp (just in case)
        clear_folder(&self.temp_folder)?;

        // Create the directories if they don't exist
        std::fs::create_dir_all(&self.yarg_folder)
            .map_err(|e| format!("Failed to create YARG directory.\n{:?}", e))?;

        Ok(())
    }

    pub async fn download_yarg(
        &self,
        app: &AppHandle,
        zip_url: String,
        sig_url: Option<String>,
        version_id: String,
    ) -> Result<(), String> {
        let folder = self.yarg_folder.join(&version_id);

        // Delete the old installation
        clear_folder(&folder)?;

        // Download the zip
        let zip_path = &self.temp_folder.join("update.zip");
        download(Some(app), &zip_url, &zip_path).await?;

        // Verify (if signature is provided)
        if let Some(sig_url) = sig_url {
            // Emit the verification
            let _ = app.emit_all(
                "progress_info",
                ProgressPayload {
                    state: "verifying".to_string(),
                    current: 0,
                    total: 0,
                },
            );

            // Download sig file (don't pass app so it doesn't emit an update)
            let sig_path = &self.temp_folder.join("update.sig");
            download(None, &sig_url, &sig_path).await?;

            // Convert public key
            let pk_box = PublicKeyBox::from_string(YARG_PUB_KEY).unwrap();
            let pk = pk_box.into_public_key().unwrap();

            // Create the signature box
            let sig_box = SignatureBox::from_file(sig_path)
                .map_err(|e| format!("Invalid signature file! Try reinstalling. If it keeps failing, let us know ASAP!\n{:?}", e))?;

            // Verify
            let zip_file = File::open(zip_path)
                .map_err(|e| format!("Failed to open zip while verifying.\n{:?}", e))?;
            minisign::verify(&pk, &sig_box, zip_file, true, false, false)
                .map_err(|_| "Failed to verify downloaded zip file! Try reinstalling. If it keeps failing, let us know ASAP!")?;
        }

        // Emit the install
        let _ = app.emit_all(
            "progress_info",
            ProgressPayload {
                state: "installing".to_string(),
                current: 0,
                total: 0,
            },
        );

        // Extract the zip to the game directory
        extract(&zip_path, &folder)?;

        // Delete zip
        let _ = remove_file(zip_path);

        Ok(())
    }

    pub fn play_yarg(&self, version_id: String) -> Result<(), String> {
        let mut path = self.yarg_folder.join(version_id);
        path = match get_os().as_str() {
            "windows" => path.join("YARG.exe"),
            "linux" => path.join("YARG"),
            "macos" => path
                .join("YARG.app")
                .join("Contents")
                .join("MacOS")
                .join("YARG"),
            _ => Err("Unknown platform for launch!")?,
        };

        Command::new(&path)
            .spawn()
            .map_err(|e| format!("Failed to start YARG. Is it installed?\n{:?}", e))?;

        Ok(())
    }

    pub fn version_exists_yarg(&self, version_id: String) -> bool {
        Path::new(&self.yarg_folder.join(version_id)).exists()
    }

    pub async fn download_setlist(
        &self,
        app: &AppHandle,
        zip_urls: Vec<String>,
        id: String,
        version: String,
    ) -> Result<(), String> {
        let folder = self.setlist_folder.join(&id);

        // Delete the old installation
        clear_folder(&folder)?;

        // Download the zip(s)
        for (index, zip_url) in zip_urls.iter().enumerate() {
            // Download the current zip
            let zip_path = &self.temp_folder.join(format!("setlist_{}.7z", index));
            download(Some(app), &zip_url, &zip_path).await?;

            // Emit the install
            let _ = app.emit_all(
                "progress_info",
                ProgressPayload {
                    state: "installing".to_string(),
                    current: 0,
                    total: 0,
                },
            );

            // Extract the zip to the game directory
            extract_setlist_part(&zip_path, &folder)?;

            // Delete zip
            let _ = remove_file(zip_path);
        }

        // Create a version.txt
        let mut file = File::create(folder.join("version.txt"))
            .map_err(|e| format!("Failed to create version file in `{:?}`.\n{:?}", folder, e))?;
        file.write_all(version.as_bytes())
            .map_err(|e| format!("Failed to write version file in `{:?}`.\n{:?}", folder, e))?;

        Ok(())
    }

    pub fn version_exists_setlist(&self, id: String, version: String) -> bool {
        let path = self.setlist_folder.join(id);
        if !Path::new(&path).exists() {
            return false;
        }

        let contents = match fs::read_to_string(&path.join("version.txt")) {
            Ok(contents) => contents,
            _ => return false,
        };

        contents == version
    }
}

pub struct State(pub Mutex<InnerState>);

#[tauri::command]
async fn init(state: tauri::State<'_, State>) -> Result<(), String> {
    let mut state_guard = state.0.lock().await;
    state_guard.init()?;

    Ok(())
}

#[tauri::command]
async fn download_yarg(
    app: AppHandle,
    state: tauri::State<'_, State>,
    zip_url: String,
    sig_url: Option<String>,
    version_id: String,
) -> Result<(), String> {
    let state_guard = state.0.lock().await;

    state_guard
        .download_yarg(&app, zip_url, sig_url, version_id)
        .await?;

    Ok(())
}

#[tauri::command]
async fn play_yarg(state: tauri::State<'_, State>, version_id: String) -> Result<(), String> {
    let state_guard = state.0.lock().await;
    state_guard.play_yarg(version_id)?;

    Ok(())
}

#[tauri::command]
async fn version_exists_yarg(
    state: tauri::State<'_, State>,
    version_id: String,
) -> Result<bool, String> {
    let state_guard = state.0.lock().await;
    Ok(state_guard.version_exists_yarg(version_id))
}

#[tauri::command]
async fn download_setlist(
    app: AppHandle,
    state: tauri::State<'_, State>,
    zip_urls: Vec<String>,
    id: String,
    version: String,
) -> Result<(), String> {
    let state_guard = state.0.lock().await;
    state_guard
        .download_setlist(&app, zip_urls, id, version)
        .await?;

    Ok(())
}

#[tauri::command]
async fn version_exists_setlist(
    state: tauri::State<'_, State>,
    id: String,
    version: String,
) -> Result<bool, String> {
    let state_guard = state.0.lock().await;
    Ok(state_guard.version_exists_setlist(id, version))
}

#[tauri::command]
fn get_os() -> String {
    std::env::consts::OS.to_string()
}

fn main() {
    tauri::Builder::default()
        .manage(State(Mutex::new(InnerState {
            yarc_folder: PathBuf::new(),
            temp_folder: PathBuf::new(),
            yarg_folder: PathBuf::new(),
            setlist_folder: PathBuf::new(),
        })))
        .invoke_handler(tauri::generate_handler![
            init,
            download_yarg,
            play_yarg,
            version_exists_yarg,
            download_setlist,
            version_exists_setlist,
            get_os
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let _ = set_shadow(&window, true);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
