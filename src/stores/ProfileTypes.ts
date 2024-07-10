export type Profile = ApplicationProfile | SetlistProfile;

interface ReleaseContent {
    name: string,
    platforms?: string[],
    files: {
        url: string,
        type: "zip" | "encrypted",
        signature: string,
    }[];
}

interface ApplicationProfile {
    type: "application",
    uuid: string,
    version: string,

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
    },

    content: ReleaseContent[],
    launchOptions: {
        [platform: string]: {
            executablePath: string,
            arguments: string
        }
    }
}

interface SetlistProfile {
    type: "setlist",
    uuid: string,
    version: string,

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
    },

    content: ReleaseContent[],
}
