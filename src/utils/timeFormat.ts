import { formatDistance } from "date-fns";
import humanizeDuration from "humanize-duration";

export const millisToDisplayLength = (length: number, long = false) => {
    if (long) {
        return humanizeDuration(length, {
            round: true
        });
    } else {
        const totalSeconds = Math.round(length / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);

        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        const secondsStr = seconds.toString().padStart(2, "0");

        if (hours === 0) {
            return `${minutes}:${secondsStr}`;
        } else {
            return `${hours}:${minutes}:${secondsStr}`;
        }
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
    return formatDistance(new Date(initial), new Date());
};

export const localizeDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};
