import { intlFormatDistance } from "date-fns";

export const millisToDisplayLength = (length: number, long = false) => {
    const date = new Date(length);
    if (long) {
        if (date.getHours() !== 0) {
            return `${date.getHours()} hr ${date.getMinutes()} min ${date.getSeconds()} sec`;
        } else {
            return `${date.getMinutes()} min ${date.getSeconds()} sec`;
        }
    } else {
        return new Intl.DateTimeFormat("en-US", {
            minute: "numeric",
            second: "numeric"
        }).format(date);
    }
};

export const isConsideredNewRelease = (releaseDate: string, newestInSetlist: string) => {
    const release = new Date(releaseDate).getTime();
    const newest = new Date(newestInSetlist).getTime();

    if (release < newest) {
        return false;
    }

    // Threshold is 30 days
    const month = 1000 * 60 * 60 * 24 * 30;
    if (release + month < Date.now()) {
        return false;
    }

    return true;
};

export const distanceFromToday = (initial: string) => {
    return intlFormatDistance(new Date(initial), new Date());
};
