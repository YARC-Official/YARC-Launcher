// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use futures_util::StreamExt;
use reqwest;
use std::{fs::File, io::Write};

// Just to test if Vite is returning
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Are you ready to YARG, {name}?")
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn download(url: &str) -> Result<String, String> {
    // Create the downloading client
    let client = reqwest::Client::new();

    // Send the initial request
    let download = client
        .get(url)
        .send()
        .await
        .or(Err(format!("Failed to init download from `{}`.", &url)))?;
    let total_size = download.content_length().unwrap();

    // Create the file to download into
    let mut file =
        File::create("A:\\projects\\YARG-Launcher\\YARG.zip").or(Err("Failed to create file."))?;
    let mut current_downloaded: u64 = 0;
    let mut stream = download.bytes_stream();

    // Download into the file
    while let Some(item) = stream.next().await {
        let chunk = item.or(Err("Error while downloading file."))?;
        file.write_all(&chunk)
            .or(Err("Error while writing to file."))?;

        // Cap the downloaded at the total size
        current_downloaded += chunk.len() as u64;
        if current_downloaded > total_size {
            current_downloaded = total_size;
        }

        // current_downloaded / total_size is progress
    }

    // Done!
    return Ok(format!("Finished downloading {} bytes", total_size));
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download])
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
