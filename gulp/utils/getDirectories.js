import fs from "fs";

import { config } from "../config.js";
import { fileExist } from "./fileExist.js";

/**
 * Retrieving all names of subdirectories containing a file of the specified extension that matches
 * the name of the subdirectory
 * @param  {String} ext — file extension to be checked
 * @return {Object}     — an array of block names
 */
export function getDirectories(ext) {
  let source = `${config.from.blocks}/`;
  return fs
    .readdirSync(source)
    .filter((item) => fs.lstatSync(source + item).isDirectory())
    .filter((item) => fileExist(source + item + "/" + item + "." + ext));
}
