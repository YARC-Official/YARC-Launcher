use std::path::Path;

use sevenz_rust::Password;

const LETTERS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
