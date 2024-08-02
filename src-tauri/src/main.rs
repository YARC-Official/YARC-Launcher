// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod utils;

use std::{fs, path::PathBuf, process::Command, sync::{LazyLock, Mutex}};

use directories::BaseDirs;
use serde_repr::{Deserialize_repr, Serialize_repr};
use tauri::{AppHandle, Manager};
use window_shadows::set_shadow;
use utils::{clear_folder, download, extract, extract_encrypted};
use clap::Parser;

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

#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseContent {
    pub name: String,
    pub platforms: Vec<String>,
    pub files: Vec<ReleaseContentFile>,
}

#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseContentFile {
    pub url: String,
    pub file_type: String,
    pub signature: Option<String>,
}

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
enum ProfileFolderState {
    Error = 0,
    UpToDate = 1,
    UpdateRequired = 2,
    FirstDownload = 3
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
fn is_dir_empty(path: String) -> bool {
    match fs::read_dir(path) {
        Ok(mut entries) => entries.next().is_none(),
        Err(_) => false,
    }
}

#[tauri::command(async)]
fn profile_folder_state(path: String, profile_version: String) -> ProfileFolderState {
    let mut version_file = PathBuf::from(&path);
    version_file.push("version.txt");

    let version_file_exists = version_file.try_exists();
    if let Ok(exists) = version_file_exists {
        if !exists {
            return ProfileFolderState::FirstDownload;
        }

        let version = fs::read_to_string(version_file);
        if let Ok(version_string) = version {
            if version_string.trim() == profile_version {
                return ProfileFolderState::UpToDate;
            } else {
                return ProfileFolderState::UpdateRequired;
            }
        } else {
            println!("Failed to read version file at `{}`", path);
            return ProfileFolderState::Error;
        }
    } else {
        println!("Failed to find if the profile exists at `{}`", path);
        return ProfileFolderState::Error;
    }
}

#[tauri::command(async)]
async fn download_and_install_profile(handle: AppHandle, profile_path: String, uuid: String, version: String,
    temp_path: String, content: Vec<ReleaseContent>) -> Result<(), String> {

    let mut temp_file = PathBuf::from(&temp_path);
    temp_file.push(format!("{}.temp", uuid));
    let _ = fs::remove_file(&temp_file);

    let mut install_path = PathBuf::from(&profile_path);
    install_path.push("installation");
    clear_folder(&install_path)?;

    // Download and install all content
    let current_os = std::env::consts::OS.to_string();
    for c in content {
        // Skip release content that is not for this OS
        if !c.platforms.iter().any(|i| i.to_owned() == current_os)  {
            continue;
        }

        for file in c.files {
            // Download
            download(&handle, &file.url, &temp_file).await?;

            // Extract/install
            if file.file_type == "zip" {
                extract(&temp_file, &install_path)?;
            } else if file.file_type == "encrypted" {
                extract_encrypted(&temp_file, &install_path)?;
            } else {
                return Err("Unhandled release file type.".to_string());
            }
        }
    }

    let mut version_file = PathBuf::from(&profile_path);
    version_file.push("version.txt");

    // Write version.txt file
    fs::write(&version_file, version).map_err(|e| format!("Failed to write version file.\n{:?}", e))?;

    Ok(())
}

#[tauri::command(async)]
fn uninstall_profile(profile_path: String) -> Result<(), String> {
    let mut install_path = PathBuf::from(&profile_path);
    install_path.push("installation");
    clear_folder(&install_path)?;

    let mut version_file = PathBuf::from(&profile_path);
    version_file.push("version.txt");
    fs::remove_file(version_file).map_err(|e| format!("Failed to remove version file.\n{:?}", e))?;

    Ok(())
}

#[tauri::command]
fn launch_profile(profile_path: String, exec_path: String, arguments: Vec<String>) -> Result<(), String> {
    let mut path = PathBuf::from(&profile_path);
    path.push("installation");
    path.push(exec_path);

    Command::new(path)
        .args(arguments)
        .spawn()
        .map_err(|e| format!("Failed to launch profile? Is the executable installed?\n{:?}", e))?;

    Ok(())
}

#[tauri::command]
fn open_folder_profile(profile_path: String) -> Result<(), String> {
    let mut path = PathBuf::from(&profile_path);
    path.push("installation");

    opener::reveal(path)
        .map_err(|e| format!("Failed to reveal folder. Is it installed?\n{:?}", e))?;

    Ok(())
}

#[tauri::command(async)]
fn get_launch_argument() -> Option<String> {
    let launch_arg = DO_LAUNCH.lock().unwrap();
    return launch_arg.to_owned();
}

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    /// UUID of the profile to launch
    #[arg(short, long)]
    launch: Option<String>
}

static DO_LAUNCH: LazyLock<Mutex<Option<String>>> = LazyLock::new(|| Mutex::new(None));

fn main() {
    let args = Args::parse();

    {
        let mut launch_option = DO_LAUNCH.lock().unwrap();
        *launch_option = args.launch;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_important_dirs,
            get_custom_dirs,
            is_dir_empty,

            profile_folder_state,
            download_and_install_profile,
            uninstall_profile,
            launch_profile,
            open_folder_profile,

            get_launch_argument
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
