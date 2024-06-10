export type Profile = ApplicationProfile | SetlistProfile;

interface ApplicationProfile {
    type: "application",
    uuid: string,
    listOrder: number,

    // For applications, the current version is fetched directly from the repo's releases.
    // This property represents the repo name from YARC-Official.
    repoName: string,

    metadata: {
        locales: {
            [language: string]: {
                name: string,
                releaseName: string,

                description: string,

                iconUrl: string,
                bannerBackUrl: string,
                bannerFrontUrl?: string,
            }
        },

        releaseDate: Date,
        websiteUrl: string,
    }
}

interface SetlistProfile {
    type: "setlist",
    uuid: string,
    listOrder: number,

    // For setlists, versions are stored on the disk directly. If the version specified on disk
    // does not match that of the profile, the user will be prompted to update.
    version: string,
    // Downloads can come from anywhere, not just GitHub. Downloads may be split up, so this is
    // an array.
    downloads: string[],

    metadata: {
        locales: {
            [language: string]: {
                name: string,

                description: string,

                iconUrl: string,
                bannerBackUrl: string,
                bannerFrontUrl?: string,
            }
        }

        releaseDate: Date,
        websiteUrl: string,

        organizer: string,
        credits: {
            name: string,
            url: string,
        }[]
    }
}
