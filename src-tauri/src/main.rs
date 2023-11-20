// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;
mod app_profile;

use app_profile::AppProfile;
use app_profile::official_setlist::OfficialSetlistProfile;
use app_profile::yarg::YARGAppProfile;
use directories::BaseDirs;
use std::fs::{self, remove_file, File};
use std::path::PathBuf;
use std::sync::RwLock;
use tauri::{AppHandle, Manager};
use utils::clear_folder;
use window_shadows::set_shadow;

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
}

pub struct State(pub RwLock<InnerState>);

#[tauri::command(async)]
fn init(state: tauri::State<State>) -> Result<(), String> {
    let mut state_guard = state.0.write().unwrap();
    state_guard.init()?;

    Ok(())
}

#[tauri::command(async)]
fn is_initialized(state: tauri::State<State>) -> Result<bool, String> {
    let state_guard = state.0.read().unwrap();
    Ok(state_guard.settings.initialized)
}

fn create_app_profile(
    app_name: String,
    state: &tauri::State<State>,
    version: String,
    profile: String
) -> Result<Box<dyn AppProfile + Send>, String> {
    let state_guard = state.0.read().unwrap();

    Ok(match app_name.as_str() {
        "yarg" => Box::new(YARGAppProfile {
            root_folder: state_guard.yarg_folder.clone(),
            temp_folder: state_guard.temp_folder.clone(),
            version,
            profile
        }),
        "official_setlist" => Box::new(OfficialSetlistProfile {
            root_folder: state_guard.setlist_folder.clone(),
            temp_folder: state_guard.temp_folder.clone(),
            version,
            profile
        }),
        _ => Err(format!("Unknown app profile `{}`.", app_name))?
    })
}

#[tauri::command]
async fn download_and_install(
    state: tauri::State<'_, State>,
    app_handle: AppHandle,
    app_name: String,
    version: String,
    profile: String,
    zip_urls: Vec<String>,
    sig_urls: Vec<String>
) -> Result<(), String> {
    let app_profile = create_app_profile(
        app_name,
        &state,
        version,
        profile
    )?;

    let result = app_profile.download_and_install(
        &app_handle,
        zip_urls,
        sig_urls
    );

    result.await?;

    Ok(())
}

#[tauri::command(async)]
fn uninstall(
    state: tauri::State<State>,
    app_name: String,
    version: String,
    profile: String
) -> Result<(), String> {
    let app_profile = create_app_profile(
        app_name,
        &state,
        version,
        profile
    )?;

    app_profile.uninstall()?;

    Ok(())
}

#[tauri::command(async)]
fn exists(
    state: tauri::State<State>,
    app_name: String,
    version: String,
    profile: String
) -> Result<bool, String> {
    let app_profile = create_app_profile(
        app_name,
        &state,
        version,
        profile
    )?;

    Ok(app_profile.exists())
}

#[tauri::command(async)]
fn launch(
    state: tauri::State<'_, State>,
    app_name: String,
    version: String,
    profile: String
) -> Result<(), String> {
    let app_profile = create_app_profile(
        app_name,
        &state,
        version,
        profile
    )?;

    app_profile.launch()
}

#[tauri::command]
fn get_os() -> String {
    std::env::consts::OS.to_string()
}

#[tauri::command]
fn is_dir_empty(path: String) -> bool {
    match fs::read_dir(path) {
        Ok(mut entries) => entries.next().is_none(),
        Err(_) => false,
    }
}

#[tauri::command(async)]
async fn set_download_location(
    state: tauri::State<'_, State>,
    path: Option<String>,
) -> Result<(), String> {
    let mut state_guard = state.0.write().unwrap();

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
fn get_download_location(state: tauri::State<'_, State>) -> Result<String, String> {
    let state_guard = state.0.read().unwrap();
    Ok(state_guard.settings.download_location.clone())
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
            is_initialized,

            download_and_install,
            uninstall,
            exists,
            launch,

            get_os,
            is_dir_empty,

            set_download_location,
            get_download_location
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            let _ = set_shadow(&window, true);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application.");
}
