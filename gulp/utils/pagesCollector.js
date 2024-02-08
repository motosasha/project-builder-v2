import path from "path";

import { config } from "../config.js";

/**
 * Retrieving all names of subdirectories containing a file of the specified extension that matches
 * the name of the subdirectory
 * @param  {String} filepath — path to file or folder
 * @return {Object}          — an array of pages
 */
export function pagesCollector(filepath) {
  const pagesCollection = [];

  if (filepath.includes(config.from.templates)) {
    const blockName = path.basename(filepath);
    const graphKey = (config.graph.templates[blockName] ??= []);

    if (graphKey) {
      graphKey.forEach((record) => {
        if (record.includes(config.from.pages)) pagesCollection.push(record);
      });
    }
  } else {
    const blockName = path.basename(filepath, ".pug");
    const graphKey = (config.graph.blocks[blockName] ??= []);

    if (graphKey) {
      graphKey.forEach((record) => {
        if (record.includes(config.from.pages)) pagesCollection.push(record);
        if (record.includes(config.from.blocks)) pagesCollection.push(...pagesCollector(record));
        if (record.includes(config.from.templates)) pagesCollection.push(...pagesCollector(record));
      });
    }
  }

  return pagesCollection;
}
