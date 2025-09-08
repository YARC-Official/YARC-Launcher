use crate::ProgressPayload;

use futures_util::StreamExt;
use lazy_static::lazy_static;
use log::warn;
use reqwest::header::{HeaderMap, HeaderValue, RANGE, USER_AGENT};
use reqwest::{self, Client};
use sevenz_rust::Password;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};

lazy_static! {
    pub static ref REQWEST_CLIENT: reqwest::Client = {
        let mut headers = HeaderMap::new();

        // Add user-agent
        headers.insert(USER_AGENT, HeaderValue::from_str("YARC-Launcher (contact@yarg.in)").unwrap());

        Client::builder()
            .tcp_keepalive(Some(Duration::from_secs(10)))
            .default_headers(headers)
            .build()
            .expect("Failed to create Reqwest client.")
    };
}

const LETTERS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const EMIT_BUFFER_RATE: f64 = 1.0 / 15.0;

pub fn path_to_string(p: PathBuf) -> Result<String, String> {
    p.into_os_string()
        .into_string()
        .map_err(|e| format!("Failed to convert path to string!\n{:?}", e))
}

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
    app_handle: Option<&AppHandle>,
    url: &str,
    output_path: &Path,
    file_count: u64,
    file_index: u64,
) -> Result<(), String> {
    let download = REQWEST_CLIENT
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Failed to initialize download from `{}`.\n{:?}", &url, e))?;
    let total_size = download.content_length().unwrap();
    // Create the file to download into
    let mut file = BufWriter::new(File::create(output_path).map_err(|e| {
        format!(
            "Failed to create file `{}`.\n{:?}",
            &output_path.display(),
            e
        )
    })?);
    let mut current_downloaded: u64 = 0;
    let mut last_resume_point = 0;

    'retry: loop {
        // Send the initial request
        let download = REQWEST_CLIENT
            .get(url)
            .header(RANGE, format!("bytes={current_downloaded}-"))
            .send()
            .await
            .map_err(|e| format!("Failed to initialize download from `{}`.\n{:?}", &url, e))?;

        let mut stream = download.bytes_stream();

        let mut emit_timer = Instant::now();

        // Download into the file
        while let Some(item) = stream.next().await {
            let chunk = match item {
                Ok(chunk) => chunk,
                Err(e) => {
                    // As long as it's making progress we'll keep trying
                    if last_resume_point < current_downloaded {
                        warn!("Error while downloading file.({e:?}) downloading file, retrying from {current_downloaded}");
                        last_resume_point = current_downloaded;
                        continue 'retry;
                    } else {
                        return Err(format!("Error while downloading file.\n{:?}", e));
                    }
                }
            };
            file.write_all(&chunk)
                .map_err(|e| format!("Error while writing to file.\n{:?}", e))?;

            // Cap the downloaded at the total size
            current_downloaded += chunk.len() as u64;
            if current_downloaded > total_size {
                current_downloaded = total_size;
            }

            // Emitting too often could cause crashes, so buffer it to the buffer rate
            if let Some(app) = app_handle {
                if emit_timer.elapsed() >= Duration::from_secs_f64(EMIT_BUFFER_RATE) {
                    let _ = app.emit(
                        "progress_info",
                        ProgressPayload {
                            state: "downloading".to_string(),
                            current: current_downloaded + (total_size * file_index),
                            total: total_size * file_count,
                        },
                    );

                    emit_timer = Instant::now();
                }
            }
        }
        // Done!
        break Ok(());
    }
}

pub fn extract(from: &Path, to: &Path) -> Result<(), String> {
    let file = File::open(from).map_err(|e| format!("Error while opening file.\n{:?}", e))?;
    zip_extract::extract(file, to, false)
        .map_err(|e| format!("Error while extracting zip.\n{:?}", e))?;

    Ok(())
}

pub fn extract_7z(from: &Path, to: &Path) -> Result<(), String> {
    sevenz_rust::decompress_file(from, to)
        .map_err(|e| format!("Error while extracting 7z.\n{:?}", e))?;
    
    Ok(())
}

pub fn extract_encrypted(from: &Path, to: &Path) -> Result<(), String> {
    // Idiot prevention
    let mut chars = Vec::new();
    for i in 0i32..64 {
        let a = 5u8.wrapping_add(i.wrapping_mul(104729) as u8);
        let b = 9u8.wrapping_add(i.wrapping_mul(224737) as u8);
        let c = a.wrapping_rem(b).wrapping_rem(52);
        chars.push(
            LETTERS
                .as_bytes()
                .get(c as usize)
                .copied()
                .ok_or("Failed to index LETTERS.")? as u16,
        );
    }

    let p: &[u16] = &chars;
    sevenz_rust::decompress_file_with_password(from, to, Password::from(p)).map_err(|e| {
        format!(
            "Failed to extract setlist part `{}`.\n{:?}",
            from.display(),
            e
        )
    })?;

    Ok(())
}
