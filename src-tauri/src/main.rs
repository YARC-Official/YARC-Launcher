// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};

use directories::BaseDirs;
use tauri::Manager;
use window_shadows::set_shadow;

#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportantDirs {
    pub yarc_folder: String,
    pub launcher_folder: String,
    pub temp_folder: String,
}

#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CustomDirs {
    pub yarg_folder: String,
    pub setlist_folder: String,
}

fn path_to_string(p: PathBuf) -> Result<String, String> {
    Ok(p.into_os_string()
        .into_string()
        .map_err(|e| format!("Failed to convert path to string!\n{:?}", e))?)
}

#[tauri::command(async)]
fn get_important_dirs() -> Result<ImportantDirs, String> {
    // Get the important directories

    let dirs = BaseDirs::new().ok_or("Failed to get base directories.")?;

    let mut yarc_folder = PathBuf::from(dirs.data_local_dir());
    yarc_folder.push("YARC");

    let mut launcher_folder = PathBuf::from(&yarc_folder);
    launcher_folder.push("Launcher");

    let mut temp_folder = PathBuf::from(&launcher_folder);
    temp_folder.push("Temp");

    // Create the directories if they don't exist

    std::fs::create_dir_all(&yarc_folder)
        .map_err(|e| format!("Failed to create YARC directory.\n{:?}", e))?;
    std::fs::create_dir_all(&launcher_folder)
        .map_err(|e| format!("Failed to create launcher directory.\n{:?}", e))?;
    std::fs::create_dir_all(&temp_folder)
        .map_err(|e| format!("Failed to create temp directory.\n{:?}", e))?;

    return Ok(ImportantDirs {
        yarc_folder: path_to_string(yarc_folder)?,
        launcher_folder: path_to_string(launcher_folder)?,
        temp_folder: path_to_string(temp_folder)?,
    });
}

#[tauri::command(async)]
fn get_custom_dirs(download_location: String) -> Result<CustomDirs, String> {
    // Get the custom directories

    let mut yarg_folder = PathBuf::from(&download_location);
    yarg_folder.push("YARG Installs");

    let mut setlist_folder = PathBuf::from(&download_location);
    setlist_folder.push("Setlists");

    // Create the directories if they don't exist

    std::fs::create_dir_all(&yarg_folder)
        .map_err(|e| format!("Failed to create YARG directory.\n{:?}", e))?;
    std::fs::create_dir_all(&setlist_folder)
        .map_err(|e| format!("Failed to create setlist directory.\n{:?}", e))?;

    return Ok(CustomDirs {
        yarg_folder: path_to_string(yarg_folder)?,
        setlist_folder: path_to_string(setlist_folder)?
    });
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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_important_dirs,
            get_custom_dirs,

            get_os,
            is_dir_empty,
        ])
        .setup(|app| {
            // Show the window's shadow
            let window = app.get_window("main").unwrap();
            let _ = set_shadow(&window, true);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application.");
}
