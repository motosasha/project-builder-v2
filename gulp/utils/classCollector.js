import path from "path";

import { config } from "../config.js";
import { fileExist } from "./fileExist.js";

/**
 * Collecting class names from file contents
 * @param  {Object} file — file buffer
 * @return {Object}      — an array with classnames
 */
export function classCollector(file) {
  const fileContent = file.contents.toString();
  const classCollection = new Set();
  let res;

  while (true) {
    res = config.classRegexp.exec(fileContent);

    if (!res) break;

    // collect classes
    // add block names
    if (res[0].includes("+") || res[0].includes(".")) res[0] = res[0].slice(1);
    // add classes in class attribute
    if (res[0].includes('class="') || res[0].includes("class='")) res[0] = res[0].slice(7, -1);
    if (res[0].includes("class= ") || res[0].includes("class=")) continue;
    // removing elements and modifiers
    if (res[0].indexOf("__") > -1 || res[0].indexOf("--") > -1) continue;
    // remove js utility classes
    if (res[0].includes("js-")) continue;
    // remove if it matches the exception class from the settings
    if (config.ignoredBlocks.indexOf(res[0]) + 1) continue;
    // remove if there is no physical representation of the block
    if (!fileExist(`${config.from.blocks}/${res[0]}`)) continue;
    // remove the use of the block itself
    if (file && res[0] === path.parse(`${file.basename}`).name) continue;

    classCollection.add(res[0]);
  }

  return classCollection;
}
