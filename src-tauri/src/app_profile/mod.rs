use tauri::AppHandle;

pub mod yarg;

trait AppProfile {
    async fn download(
        &self,
        app: &AppHandle,
        zip_url: String,
        sig_url: Option<String>
    ) -> Result<(), String>;

    fn uninstall(
        &self
    ) -> Result<(), String>;
}

trait LaunchableAppProfile {
    fn launch(
        &self
    ) -> Result<(), String>;
}