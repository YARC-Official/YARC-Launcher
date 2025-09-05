use clap::{command, Parser};
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub struct CommandLineArgs {
    /// UUID of the profile to launch
    #[arg(short, long)]
    pub launch: Option<String>,
}

#[derive(Clone, serde::Serialize)]
pub struct ProgressPayload {
    pub state: String,
    pub total: u64,
    pub current: u64,
}

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
    pub venue_folder: String,
}

// WARNING: This type is also defined in TypeScript. Make sure to change it in both places!
#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseContent {
    pub platforms: Vec<String>,
    pub files: Vec<ReleaseContentFile>,
}

#[derive(Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseContentFile {
    pub url: String,
    pub sig_url: Option<String>,
    pub file_type: String,
}

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
pub enum ProfileFolderState {
    Error = 0,
    UpToDate = 1,
    UpdateRequired = 2,
    FirstDownload = 3,
}
