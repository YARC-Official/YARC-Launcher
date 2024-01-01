import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "@octokit/types";
import { OsType } from "@tauri-apps/api/os";

export type YARGChannels = "stable" | "nightly";

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
        select: (data): ExtendedReleaseData => ({ ...data, channel: channel })
    });
};

export const getYARGReleaseZip = (releaseData: ReleaseData, platformType: OsType) => {
    const suffixesPerPlatform: {[key in OsType]: string[]} = {
        "Windows_NT": ["Windows-x64.zip"],
        "Darwin": ["MacOS-Universal.zip"],
        "Linux": ["Linux-x86_64.zip", "Linux-x64.zip"],
    };

    const platformSuffixes = suffixesPerPlatform[platformType];

    const asset = releaseData.assets.find(asset => {
        return platformSuffixes.find(suffix => asset.name.endsWith(suffix));
    });

    if(asset) return asset.browser_download_url;

    // Otherwise, the platform is not supported!
    throw new Error(`Platform of type "${platformType}" is not supported in release "${releaseData.tag_name}"!`);
};

export const getYARGReleaseSigFromZipURL = (releaseData: ReleaseData, zipUrl: string) => {
    const sigAssetName = zipUrl.split("/").slice(-1) + ".sig";

    const asset = releaseData.assets.find(asset => asset.name === sigAssetName);

    if(asset) return asset.browser_download_url;

    // Otherwise, there's no signature
    console.warn(`Failed to find signature file "${sigAssetName}" in release "${releaseData.tag_name}"!`);
    return undefined;
};