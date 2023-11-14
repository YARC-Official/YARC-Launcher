use tauri::AppHandle;
use async_trait::async_trait;

pub mod yarg;

pub const YARG_PUB_KEY: &str = "untrusted comment: minisign public key C26EBBBEC4C1DB81
RWSB28HEvrtuwvPn3pweVBodgVi/d+UH22xDsL3K8VBgeRqaIrDdTvps
";

#[derive(Clone, serde::Serialize)]
pub struct ProgressPayload {
    pub state: String,
    pub total: u64,
    pub current: u64,
}

#[async_trait]
trait AppProfile {
    async fn download_and_install(
        &self,
        app: &AppHandle,
        zip_url: String,
        sig_url: Option<String>
    ) -> Result<(), String>;

    fn install(
        &self
    ) -> Result<(), String>;

    fn uninstall(
        &self
    ) -> Result<(), String>;

    fn exists(
        &self
    ) -> bool;
}

trait LaunchableAppProfile {
    fn launch(
        &self
    ) -> Result<(), String>;
}