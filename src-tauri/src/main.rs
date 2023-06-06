// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use directories::BaseDirs;
use futures_util::StreamExt;
use reqwest;
use std::path::Path;
use std::{fs::File, io::Write};

#[tauri::command]
async fn download_yarg() -> Result<(), String> {
    // Get the directories
    let dirs = BaseDirs::new().ok_or("Failed to get directories.")?;
    let yarc_folder = Path::new(dirs.data_local_dir()).join("YARC");
    let temp_folder = yarc_folder.join("Launcher").join("Temp");
    let yarg_folder = yarc_folder.join("YARG");

    // Delete everything temp (just in case)
    std::fs::remove_dir_all(&temp_folder).ok();

    // Delete the old installation
    std::fs::remove_dir_all(&yarg_folder).ok();

    // Create them if they don't exist
    std::fs::create_dir_all(&temp_folder)
        .map_err(|e| format!("Failed to create launcher directory.\n{:?}", e))?;
    std::fs::create_dir_all(&yarg_folder)
        .map_err(|e| format!("Failed to create YARG directory.\n{:?}", e))?;

    // Download the zip
    let zip_path = temp_folder.join("update.zip");
    download("https://github.com/YARC-Official/YARG/releases/download/v0.10.5/YARG_v0.10.5-Windows-x64.zip", 
		&zip_path).await?;

    // Extract the zip to the game directory
    extract(&zip_path, &yarg_folder)?;

    // Delete everything temp
    std::fs::remove_dir_all(&temp_folder).ok();

    return Ok(());
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
    return Ok(());
}

fn extract(from: &Path, to: &Path) -> Result<(), String> {
    let file = File::open(from).map_err(|e| format!("Error while opening file.\n{:?}", e))?;
    zip_extract::extract(file, to, false)
        .map_err(|e| format!("Error while extracting zip.\n{:?}", e))?;

    return Ok(());
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download_yarg])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
