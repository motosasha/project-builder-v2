/**
 * Getting the difference between two arrays
 * @param  {Object} a1 — first array
 * @param  {Object} a2 — second array
 * @return {Object}    — an array with different elements
 */
export function getArraysDiff(a1, a2) {
  return a1.filter((i) => !a2.includes(i)).concat(a2.filter((i) => !a1.includes(i)));
}
