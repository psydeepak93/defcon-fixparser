export const SOH: string = '\x01';
export const STRING_EQUALS: string = '=';
export const RE_ESCAPE: RegExp = /[.*+?^${}()|[\]\\]/g; // eslint-disable-line no-useless-escape
export const RE_FIND: RegExp = /8=FIXT?\.\d\.\d([^\d]+)/i;

export function groupBy<T, K>(list: T[], getKey: (item: T) => K) {
    const map = new Map<K, T[]>();
    list.forEach((item) => {
        const key = getKey(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return Array.from(map.values());
}

export const pad = (value: number, size: number) => {
    const paddedString = `00${value}`;
    return paddedString.substr(paddedString.length - size);
};

export const adjustForTimezone = (date: Date) => {
    const timeOffsetInMS = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
};

export const timestamp = (dateObject: Date) => {
    if (isNaN(dateObject.getTime())) {
        console.error('Invalid date specified!');
    }
    const date = adjustForTimezone(dateObject);
    return `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(
        date.getDate(),
        2,
    )}-${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(
        date.getSeconds(),
        2,
    )}.${pad(date.getMilliseconds(), 3)}`;
};
