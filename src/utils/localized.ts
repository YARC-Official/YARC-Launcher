export type Localized<T> = T & {
    localeOverrides: {
        [locales: string]: Partial<T>
    }
}

export const localize = <T, K extends keyof T>(obj: Localized<T>, key: K, locale: string): T[K] => {
    let value: T[K] = obj[key];

    if (locale in obj.localeOverrides) {
        const newValue = obj.localeOverrides[locale][key];
        if (newValue !== undefined) {
            value = newValue as T[K];
        }
    }

    return value;
};

export const localizeObject = <T>(obj: Localized<T>, locale: string): T => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        localeOverrides,
        ...omittedObj
    } = obj;
    const newObj = omittedObj as T;

    if (obj.localeOverrides === undefined) {
        return newObj;
    }

    if (locale in obj.localeOverrides) {
        const override = obj.localeOverrides[locale];

        let key: keyof T;
        for (key in override) {
            const value = override[key];
            if (value !== undefined) {
                newObj[key] = value as T[keyof T];
            }
        }
    }

    return newObj;
};
