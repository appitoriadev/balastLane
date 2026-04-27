/**
 * Merge class names, filtering out falsy values.
 * Lightweight alternative to `clsx` without adding a dependency.
 *
 * @param {...(string|undefined|null|false)} classes
 * @returns {string}
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');
