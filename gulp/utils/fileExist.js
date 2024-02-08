import fs from "fs";

/**
 * Checking the existence of a file or folder
 * @param  {String} filepath — path to file or folder
 * @return {Boolean}         — exist or not
 */
export function fileExist(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}
