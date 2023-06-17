use std::path::Path;

const SETLIST_ZIP_KEY: &str = "this_is_a_test_password";

pub fn extract_setlist_part(zip: &Path, output_path: &Path) -> Result<(), String> {
    sevenz_rust::decompress_file_with_password(zip, output_path, SETLIST_ZIP_KEY.into()).map_err(
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
