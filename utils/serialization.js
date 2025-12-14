/**
 * Stringifies a value, handling BigInts by converting them to strings with an 'n' suffix
 * to distinguish them from regular strings.
 * @param {any} value 
 * @returns {string}
 */
export function bigIntStringify(value) {
    return JSON.stringify(value, (key, val) =>
        typeof val === 'bigint'
            ? val.toString() + 'n'
            : val
        , 2);
}

/**
 * Parses a JSON string, converting strings ending in 'n' back to BigInts
 * if they are valid integers.
 * @param {string} text 
 * @returns {any}
 */
export function bigIntParse(text) {
    return JSON.parse(text, (key, val) => {
        if (typeof val === 'string' && /^-?\d+n$/.test(val)) {
            return BigInt(val.slice(0, -1));
        }
        return val;
    });
}
