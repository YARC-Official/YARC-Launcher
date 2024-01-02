use async_trait::async_trait;
use minisign::{PublicKeyBox, SignatureBox};
use tauri::Manager;
use std::{path::{PathBuf, Path}, fs::{File, remove_file}, process::Command};

use crate::utils::*;

use super::*;

pub struct YARGAppProfile {
    pub root_folder: PathBuf,
    pub temp_folder: PathBuf,
    pub version: String,
    pub profile: String
}

impl YARGAppProfile {
    fn get_folder(
        &self
    ) -> PathBuf {
        self.root_folder.join(&self.profile).join(&self.version)
    }

    fn get_exec(
        &self
    ) -> Result<PathBuf, String> {
        let mut path = self.get_folder();

        // Each OS has a different executable
        path = match std::env::consts::OS.to_string().as_str() {
            "windows" => path.join("YARG.exe"),
            "linux" => {
                // Stable uses "YARG.x86_64", and nightly uses "YARG". Look for both
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
}

#[async_trait]
impl AppProfile for YARGAppProfile {
    async fn download_and_install(
        &self,
        app: &tauri::AppHandle,
        zip_urls: Vec<String>,
        sig_urls: Vec<String>
    ) -> Result<(), String> {
        let mut folder = self.root_folder.join(&self.profile);

        let zip_url = zip_urls.first().ok_or("Did not get any zip URLs.")?;
        let sig_url = sig_urls.first();

        // Delete the old installation
        clear_folder(&folder)?;

        // Move into the version's folder
        folder = folder.join(&self.version);

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

        // Emit the install (count extracting as installing)
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

        // Do the rest of the installation
        self.install()?;

        Ok(())
    }

    fn install(
        &self
    ) -> Result<(), String> {
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
        Path::new(&self.get_folder()).exists()
    }

    fn launch(
        &self
    ) -> Result<(), String> {
        let path = self.get_exec()?;
        Command::new(&path)
            .spawn()
            .map_err(|e| format!("Failed to start YARG. Is it installed?\n{:?}", e))?;
        Ok(())
    }

    fn reveal_folder(
        &self
    ) -> Result<(), String> {
        if !self.exists() {
            return Err("Cannot reveal something that doesn't exist!".to_string());
        }

        opener::reveal(self.get_folder())
            .map_err(|e| format!("Failed to reveal folder. Is it installed?\n{:?}", e))?;

        Ok(())
    }
}