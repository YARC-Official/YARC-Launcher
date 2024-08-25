import { intlFormatDistance } from "date-fns";
import prettyMilliseconds from "pretty-ms";

export const millisToDisplayLength = (length: number, long = false) => {
    return prettyMilliseconds(length, {
        colonNotation: !long,
        secondsDecimalDigits: 0,
    });
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

export const localizeDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};
