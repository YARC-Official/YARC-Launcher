export const millisToDisplayLength = (length: number, long = false) => {
    const date = new Date(length);
    if (long) {
        return `${date.getMinutes()} min ${date.getSeconds()} sec`;
    } else {
        return new Intl.DateTimeFormat("en-US", {
            minute: "numeric",
            second: "numeric"
        }).format(date);
    }
};