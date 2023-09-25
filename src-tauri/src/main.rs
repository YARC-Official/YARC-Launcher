// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;

use directories::BaseDirs;
use minisign::{PublicKeyBox, SignatureBox};
use std::fs::{self, remove_file};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::{fs::File, io::Write};
use tauri::async_runtime::RwLock;
use tauri::{AppHandle, Manager};
use utils::{clear_folder, download, extract, extract_setlist_part};
use window_shadows::set_shadow;

// TODO: Move this to a file or something
const YARG_PUB_KEY: &str = "untrusted comment: minisign public key C26EBBBEC4C1DB81
RWSB28HEvrtuwvPn3pweVBodgVi/d+UH22xDsL3K8VBgeRqaIrDdTvps
";

#[derive(Clone, serde::Serialize)]
pub struct ProgressPayload {
    pub state: String,
    pub total: u64,
    pub current: u64,
}

#[derive(Default, serde::Serialize, serde::Deserialize)]
pub struct Settings {
    pub download_location: String,
    pub initialized: bool,
}

pub struct InnerState {
    pub yarc_folder: PathBuf,
    pub launcher_folder: PathBuf,
    pub temp_folder: PathBuf,
    pub yarg_folder: PathBuf,
    pub setlist_folder: PathBuf,

    pub settings: Settings,
}

impl InnerState {
    pub fn init(&mut self) -> Result<(), String> {
        let dirs = BaseDirs::new().ok_or("Failed to get directories.")?;

        self.yarc_folder = PathBuf::from(dirs.data_local_dir());
        self.yarc_folder.push("YARC");

        self.launcher_folder = PathBuf::from(&self.yarc_folder);
        self.launcher_folder.push("Launcher");

        self.temp_folder = PathBuf::from(&self.launcher_folder);
        self.temp_folder.push("Temp");

        // Create launcher directory (for the settings)
        std::fs::create_dir_all(&self.launcher_folder)
            .map_err(|e| format!("Failed to create launcher directory.\n{:?}", e))?;

        // Load settings
        let settings_path = self.launcher_folder.join("settings.json");
        if settings_path.exists() {
            // Get file
            let settings_file = File::open(settings_path)
                .map_err(|e| format!("Failed to open settings.json file.\n{:?}", e))?;

            // Convert from json and save to settings
            let settings: Result<Settings, _> = serde_json::from_reader(settings_file);
            if let Ok(settings) = settings {
                self.settings = settings;
            } else {
                self.create_new_settings_file()?;
            }
        } else {
            self.create_new_settings_file()?;
        }

        // Set the rest of the folder locations based on settings
        self.set_download_locations()?;

        // Delete everything temp (just in case)
        clear_folder(&self.temp_folder)?;

        Ok(())
    }

    fn set_download_locations(&mut self) -> Result<(), String> {
        self.yarg_folder = PathBuf::from(&self.settings.download_location);
        self.yarg_folder.push("YARG Installs");

        self.setlist_folder = PathBuf::from(&self.settings.download_location);
        self.setlist_folder.push("Setlists");

        // Create the directories if they don't exist
        std::fs::create_dir_all(&self.yarg_folder)
            .map_err(|e| format!("Failed to create YARG directory.\n{:?}", e))?;
        std::fs::create_dir_all(&self.setlist_folder)
            .map_err(|e| format!("Failed to create setlist directory.\n{:?}", e))?;

        Ok(())
    }

    fn create_new_settings_file(&mut self) -> Result<(), String> {
        // Create new settings
        self.settings = Default::default();
        self.settings.download_location = self
            .yarc_folder
            .clone()
            .into_os_string()
            .into_string()
            .unwrap();

        // Then save
        self.save_settings_file()?;

        Ok(())
    }

    pub fn save_settings_file(&mut self) -> Result<(), String> {
        // Delete the old settings (if it exists)
        let settings_path = self.launcher_folder.join("settings.json");
        let _ = remove_file(&settings_path);

        // Create settings file
        let settings_file = File::create(settings_path)
            .map_err(|e| format!("Failed to create settings file.\n{:?}", e))?;

        // Write to file
        serde_json::to_writer(settings_file, &self.settings)
            .map_err(|e| format!("Failed to write to settings file.\n{:?}", e))?;

        Ok(())
    }

    pub async fn download_yarg(
        &self,
        app: &AppHandle,
        zip_url: String,
        sig_url: Option<String>,
        version_id: String,
        profile: String,
    ) -> Result<(), String> {
        let mut folder = self.yarg_folder.join(&profile);

        // Delete the old installation
        clear_folder(&folder)?;

        // Move into the version's folder
        folder = folder.join(&version_id);

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
        let _ = remove_file(&zip_path);

        // Change permissions (if on Linux)
        self.set_permissions(version_id, profile)?;

        Ok(())
    }

    #[cfg(not(target_os = "linux"))]
    fn set_permissions(&self, _a: String, _b: String) -> Result<(), String> {
        Ok(())
    }

    #[cfg(target_os = "linux")]
    fn set_permissions(&self, version_id: String, profile: String) -> Result<(), String> {
        use std::os::unix::prelude::PermissionsExt;

        let exec = self.get_yarg_exec(version_id, profile)?;

        let mut perms = fs::metadata(&exec)
            .map_err(|e| format!("Failed to get permissions of file.\n{:?}", e))?
            .permissions();
        perms.set_mode(0o7111);
        fs::set_permissions(&exec, perms)
            .map_err(|e| format!("Failed to set permissions of file.\n{:?}", e))?;

        Ok(())
    }

    fn get_yarg_exec(&self, version_id: String, profile: String) -> Result<PathBuf, String> {
        let mut path = self.yarg_folder.join(profile).join(version_id);
        path = match get_os().as_str() {
            "windows" => path.join("YARG.exe"),
            "linux" => {
                // Stable uses "YARG.x86_64", and nightly uses "YARG"
                let mut p = path.join("YARG.x86_64");
                if !p.exists() {
                    p = path.join("YARG");
                }
                p
            }
            "macos" => path
                .join("YARG.app")
                .join("Contents")
                .join("MacOS")
                .join("YARG"),
            _ => Err("Unknown platform for launch!")?,
        };

        Ok(path)
    }

    pub fn play_yarg(&self, version_id: String, profile: String) -> Result<(), String> {
        let path = self.get_yarg_exec(version_id, profile)?;
        Command::new(&path)
            .spawn()
            .map_err(|e| format!("Failed to start YARG. Is it installed?\n{:?}", e))?;

        Ok(())
    }

    pub fn version_exists_yarg(&self, version_id: String, profile: String) -> bool {
        Path::new(&self.yarg_folder.join(profile).join(version_id)).exists()
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

pub struct State(pub RwLock<InnerState>);

#[tauri::command]
async fn init(state: tauri::State<'_, State>) -> Result<(), String> {
    let mut state_guard = state.0.write().await;
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
    profile: String,
) -> Result<(), String> {
    let state_guard = state.0.read().await;

    state_guard
        .download_yarg(&app, zip_url, sig_url, version_id, profile)
        .await?;

    Ok(())
}

#[tauri::command]
async fn play_yarg(
    state: tauri::State<'_, State>,
    version_id: String,
    profile: String,
) -> Result<(), String> {
    let state_guard = state.0.read().await;
    state_guard.play_yarg(version_id, profile)?;

    Ok(())
}

#[tauri::command]
async fn version_exists_yarg(
    state: tauri::State<'_, State>,
    version_id: String,
    profile: String,
) -> Result<bool, String> {
    let state_guard = state.0.read().await;
    Ok(state_guard.version_exists_yarg(version_id, profile))
}

#[tauri::command]
async fn download_setlist(
    app: AppHandle,
    state: tauri::State<'_, State>,
    zip_urls: Vec<String>,
    id: String,
    version: String,
) -> Result<(), String> {
    let state_guard = state.0.read().await;
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
    let state_guard = state.0.read().await;
    Ok(state_guard.version_exists_setlist(id, version))
}

#[tauri::command]
fn get_os() -> String {
    std::env::consts::OS.to_string()
}

#[tauri::command]
async fn is_initialized(state: tauri::State<'_, State>) -> Result<bool, String> {
    let state_guard = state.0.read().await;
    Ok(state_guard.settings.initialized)
}

#[tauri::command]
async fn set_download_location(
    state: tauri::State<'_, State>,
    path: Option<String>,
) -> Result<(), String> {
    let mut state_guard = state.0.write().await;

    // If this is None, just use the default
    if let Some(path) = path {
        state_guard.settings.download_location = path.clone();
    }

    state_guard.settings.initialized = true;

    state_guard.set_download_locations()?;
    state_guard.save_settings_file()?;

    Ok(())
}

#[tauri::command]
async fn get_download_location(state: tauri::State<'_, State>) -> Result<String, String> {
    let state_guard = state.0.read().await;
    Ok(state_guard.settings.download_location.clone())
}

#[tauri::command]
fn is_dir_empty(path: String) -> bool {
    match fs::read_dir(path) {
        Ok(mut entries) => entries.next().is_none(),
        Err(_) => false,
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .manage(State(RwLock::new(InnerState {
            yarc_folder: PathBuf::new(),
            launcher_folder: PathBuf::new(),
            temp_folder: PathBuf::new(),
            yarg_folder: PathBuf::new(),
            setlist_folder: PathBuf::new(),
            settings: Default::default(),
        })))
        .invoke_handler(tauri::generate_handler![
            init,
            download_yarg,
            play_yarg,
            version_exists_yarg,
            download_setlist,
            version_exists_setlist,
            get_os,
            is_initialized,
            set_download_location,
            get_download_location,
            is_dir_empty
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let _ = set_shadow(&window, true);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application.");
}
