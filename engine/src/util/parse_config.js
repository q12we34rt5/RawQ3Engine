/**
 * Return `def` if `opt` is undefined, else return `def`.
 * @param {any} opt optional
 * @param {any} def default
 * @returns {any}
 */
export default function parseConfig(opt, def) {
    return opt == undefined ? def : opt;
}
