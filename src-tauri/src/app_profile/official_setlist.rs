use async_trait::async_trait;
use tauri::Manager;
use std::{path::{PathBuf, Path}, fs::{File, remove_file, read_to_string}, io::Write};

use crate::utils::*;

use super::*;

pub struct OfficialSetlistProfile {
    pub root_folder: PathBuf,
    pub temp_folder: PathBuf,
    pub version: String,
    pub profile: String
}

#[async_trait]
impl AppProfile for OfficialSetlistProfile {
    async fn download_and_install(
        &self,
        app: &tauri::AppHandle,
        zip_urls: Vec<String>,
        _sig_urls: Vec<String>
    ) -> Result<(), String> {
        let folder = self.root_folder.join(&self.profile);

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

        self.install()?;

        Ok(())
    }

    fn install(
        &self
    ) -> Result<(), String> {
        let folder = self.root_folder.join(&self.profile);

        // Create a version.txt
        let mut file = File::create(folder.join("version.txt"))
            .map_err(|e| format!("Failed to create version file in `{:?}`.\n{:?}", folder, e))?;
        file.write_all(&self.version.as_bytes())
            .map_err(|e| format!("Failed to write version file in `{:?}`.\n{:?}", folder, e))?;

        Ok(())
    }

    fn uninstall(
        &self
    ) -> Result<(), String> {
        let folder = self.root_folder.join(&self.profile);
        std::fs::remove_dir_all(folder)
            .map_err(|e| format!("Failed to remove directory.\n{:?}", e))
    }

    fn exists(
        &self
    ) -> bool {
        let path = self.root_folder.join(&self.profile);
        if !Path::new(&path).exists() {
            return false;
        }

        let contents = match read_to_string(&path.join("version.txt")) {
            Ok(contents) => contents,
            _ => return false,
        };

        contents == self.version
    }

    fn launch(
        &self
    ) -> Result<(), String> {
        Err("Cannot launch the setlist!".to_string())
    }
}