export const SOH = '\x01';
export const STRING_EQUALS = '=';
export const RE_ESCAPE = /[.*+?^${}()|[\]\\]/g; // eslint-disable-line no-useless-escape
export const RE_FIND = /8=FIXT?\.\d\.\d([^\d]+)/i;

export const pad = (value, size) => {
    const paddedString = `00${value}`;
    return paddedString.substr(paddedString.length - size);
};

export const groupBy = (xs, key) =>
    xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});

export const adjustForTimezone = (date) => {
    const timeOffsetInMS = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() + timeOffsetInMS);
    return date;
};

export const timestamp = (dateObject) => {
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
