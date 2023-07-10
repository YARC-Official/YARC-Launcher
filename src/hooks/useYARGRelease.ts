import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "@octokit/types";
import { invoke } from "@tauri-apps/api/tauri";

export type YARGChannels = "stable"|"nightly";

type ReleaseData = Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]["data"];
export type ExtendedReleaseData = ReleaseData & {
    channel: YARGChannels
};

export const useYARGRelease = (channel: YARGChannels) => {
    const repositoryName = {
        "stable": "YARG",
        "nightly": "YARG-BleedingEdge"
    };

    return useQuery({
        queryKey: ["YARG", channel],
        queryFn: async (): Promise<ReleaseData> => await fetch(
            `https://api.github.com/repos/YARC-Official/${repositoryName[channel]}/releases/latest`)
            .then(res => res.json()),
        select: (data): ExtendedReleaseData => ({...data, channel: channel})
    }).data as ExtendedReleaseData;
};

export const getYARGReleaseZip = async (releaseData: ReleaseData) => {
    const os = await invoke("get_os") as string;

    // Get the zip suffix depending on the OS
    let zipSuffixes: string[] = [];
    switch (os) {
        case "windows":
            zipSuffixes = ["Windows-x64.zip"];
            break;
        case "macos":
            zipSuffixes = ["MacOS-Universal.zip"];
            break;
        case "linux":
            zipSuffixes = ["Linux-x86_64.zip", "Linux-x64.zip"];
            break;
    }

    // Find the zip in the assets
    for (const asset of releaseData.assets) {
        // Check all of the suffixes
        let skip = true;
        for (const suffix of zipSuffixes) {
            if (asset.name.endsWith(suffix)) {
                skip = false;
                break;
            }
        }

        // If not found, continue
        if (skip) {
            continue;
        }

        // Done!
        return asset.browser_download_url;
    }

    // Otherwise, the platform is not supported!
    throw new Error(`Platform "${os}" is not supported in release "${releaseData.tag_name}"!`);
};

export const getYARGReleaseSig = async (releaseData: ReleaseData) => {
    const zip = await getYARGReleaseZip(releaseData);
    const sig = zip.split("/").at(-1) + ".sig";

    // Find the zip in the assets
    for (const asset of releaseData.assets) {
        if (asset.name == sig) {
            return asset.browser_download_url;
        }
    }

    // Otherwise, there's no signature
    console.warn(`Failed to find signature file "${sig}" in release "${releaseData.tag_name}"!`);
    return undefined;
};