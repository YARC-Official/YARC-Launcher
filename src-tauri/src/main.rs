// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use directories::BaseDirs;
use futures_util::lock::Mutex;
use futures_util::StreamExt;
use reqwest;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::{fs::File, io::Write};

pub struct InnerState {
    pub yarc_folder: PathBuf,
    pub temp_folder: PathBuf,
    pub yarg_folder: PathBuf,
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

        // Delete everything temp (just in case)
        clear_folder(&self.temp_folder)?;

        // Create the directories if they don't exist
        std::fs::create_dir_all(&self.yarg_folder)
            .map_err(|e| format!("Failed to create YARG directory.\n{:?}", e))?;

        Ok(())
    }

    pub async fn download_yarg(&self, zip_url: String, version_id: String) -> Result<(), String> {
        let folder = self.yarg_folder.join(version_id);

        // Delete the old installation
        clear_folder(&folder)?;

        // Download the zip
        let zip_path = &self.temp_folder.join("update.zip");
        download(&zip_url, &zip_path).await?;

        // Extract the zip to the game directory
        extract(&zip_path, &folder)?;

        // Delete everything temp
        clear_folder(&self.temp_folder)?;

        Ok(())
    }

    pub fn play_yarg(&self, version_id: String) -> Result<(), String> {
        Command::new(&self.yarg_folder.join(version_id).join("YARG.exe"))
            .spawn()
            .map_err(|e| format!("Failed to start YARG. Is it installed?\n{:?}", e))?;

        Ok(())
    }

    pub fn version_exists_yarg(&self, version_id: String) -> bool {
        Path::new(&self.yarg_folder.join(version_id)).exists()
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
    state: tauri::State<'_, State>,
    zip_url: String,
    version_id: String,
) -> Result<(), String> {
    let state_guard = state.0.lock().await;
    state_guard.download_yarg(zip_url, version_id).await?;

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
fn get_os() -> String {
    std::env::consts::OS.to_string()
}

fn clear_folder(path: &Path) -> Result<(), String> {
    std::fs::remove_dir_all(path).ok();
    std::fs::create_dir_all(path).map_err(|e| {
        format!(
            "Failed to re-create folder `{}`.\n{:?}",
            path.to_string_lossy(),
            e
        )
    })?;

    Ok(())
}

async fn download(url: &str, output_path: &Path) -> Result<(), String> {
    // Create the downloading client
    let client = reqwest::Client::new();

    // Send the initial request
    let download = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Failed to initialize download from `{}`.\n{:?}", &url, e))?;
    let total_size = download.content_length().unwrap();

    // Create the file to download into
    let mut file = File::create(output_path).map_err(|e| {
        format!(
            "Failed to create file `{}`.\n{:?}",
            &output_path.display(),
            e
        )
    })?;
    let mut current_downloaded: u64 = 0;
    let mut stream = download.bytes_stream();

    // Download into the file
    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| format!("Error while downloading file.\n{:?}", e))?;
        file.write_all(&chunk)
            .map_err(|e| format!("Error while writing to file.\n{:?}", e))?;

        // Cap the downloaded at the total size
        current_downloaded += chunk.len() as u64;
        if current_downloaded > total_size {
            current_downloaded = total_size;
        }

        // current_downloaded / total_size is progress
    }

    // Done!
    Ok(())
}

fn extract(from: &Path, to: &Path) -> Result<(), String> {
    clear_folder(to)?;

    let file = File::open(from).map_err(|e| format!("Error while opening file.\n{:?}", e))?;
    zip_extract::extract(file, to, false)
        .map_err(|e| format!("Error while extracting zip.\n{:?}", e))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(State(Mutex::new(InnerState {
            yarc_folder: PathBuf::new(),
            temp_folder: PathBuf::new(),
            yarg_folder: PathBuf::new(),
        })))
        .invoke_handler(tauri::generate_handler![
            init,
            download_yarg,
            play_yarg,
            version_exists_yarg,
            get_os
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
