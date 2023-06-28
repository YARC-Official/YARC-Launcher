use futures_util::StreamExt;
use reqwest;
use sevenz_rust::Password;
use std::path::Path;
use std::{fs::File, io::Write};
use tauri::{AppHandle, Manager};

use crate::ProgressPayload;

const LETTERS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

pub fn clear_folder(path: &Path) -> Result<(), String> {
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

pub async fn download(
    app: Option<&AppHandle>,
    url: &str,
    output_path: &Path,
) -> Result<(), String> {
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

        // Emit the download progress
        if let Some(app) = app {
            let _ = app.emit_all(
                "progress_info",
                ProgressPayload {
                    state: "downloading".to_string(),
                    current: current_downloaded,
                    total: total_size,
                },
            );
        }
    }

    // Done!
    Ok(())
}

pub fn extract(from: &Path, to: &Path) -> Result<(), String> {
    clear_folder(to)?;

    let file = File::open(from).map_err(|e| format!("Error while opening file.\n{:?}", e))?;
    zip_extract::extract(file, to, false)
        .map_err(|e| format!("Error while extracting zip.\n{:?}", e))?;

    Ok(())
}

pub fn extract_setlist_part(zip: &Path, output_path: &Path) -> Result<(), String> {
    // Idiot prevention
    let mut chars = Vec::new();
    for i in 0i32..64 {
        let a = 5u8.wrapping_add(i.wrapping_mul(104729) as u8);
        let b = 9u8.wrapping_add(i.wrapping_mul(224737) as u8);
        let c = a.wrapping_rem(b).wrapping_rem(52);
        chars.push(
            LETTERS
                .bytes()
                .nth(c as usize)
                .ok_or("Failed to index LETTERS.")? as u16,
        );
    }

    let p: &[u16] = &chars;
    sevenz_rust::decompress_file_with_password(zip, output_path, Password::from(p)).map_err(
        |e| {
            format!(
                "Failed to extract setlist part `{}`.\n{:?}",
                zip.display(),
                e
            )
        },
    )?;

    Ok(())
}
