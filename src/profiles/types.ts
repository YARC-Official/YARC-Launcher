import { Localized } from "@app/utils/localized";
import { OS } from "@app/utils/os";

// WARNING: This type is also defined in Rust. Make sure to change it in both places!
export interface ReleaseContent {
    platforms?: OS[],
    files: {
        url: string,
        sigUrl?: string,
        fileType: "zip" | "encrypted",
    }[];
}

export type VersionList = {
    uuid: string,
    url: string,
    tag: string,
    release: string,
}[];

export interface Version {
    uuid: string,
    tag: string,
    release: string,
    content: ReleaseContent[],
    launchOptions?: {
        [platform in OS]?: {
            executablePath: string,
            arguments: string[],
            offlineArgument?: string,
            languageArgument?: string
        }
    }
}

export type VersionInfo = VersionInfoList | VersionInfoUrl | VersionInfoEmbedded;

export interface VersionInfoList {
    type: "list",

    listUrl: string,
}

export interface VersionInfoUrl {
    type: "url",

    releaseUrl: string,
}

export interface VersionInfoEmbedded {
    type: "embedded",

    version: Version,
}

export interface Metadata {
    name: string,
    description: string,

    iconUrl: string,
    bannerBackUrl: string,
    bannerFrontUrl?: string,

    initialRelease: string,
    newsCategory?: string,

    links: {
        [id: string]: {
            name: string,
            url: string,
        }
    },
}

export type ApplicationMetadata = Localized<Metadata & {
    releaseName: string,
}>;

export type SetlistMetadata = Localized<Metadata & {
    credits: {
        name: string,
        url: string,
    }[],
}>;

export type Profile = ApplicationProfile | SetlistProfile;

export interface ApplicationProfile {
    type: "application",

    uuid: string,
    metadata: ApplicationMetadata,
    version: VersionInfo,
}

export interface SetlistProfile {
    type: "setlist",

    uuid: string,
    metadata: SetlistMetadata,
    version: VersionInfo,
}

export interface ActiveProfile {
    uuid: string,
    originalUrl: string,

    displayName?: string,
    lastPlayed?: string,
    selectedVersion?: string,

    profile: Profile,
    version: Version,
}
