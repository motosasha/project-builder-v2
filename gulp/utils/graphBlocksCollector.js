import { config } from "../config.js";

config.blocksFromHtml = [...config.alwaysAddBlocks];

/**
 * Traversing the found classes and adding the class to the graph
 * @param  {Object} classes — an array of classes
 * @param  {Object} file    — file buffer
 */
export function graphBlocksCollector(classes, file) {
  const blocksList = [];

  for (let item of classes) {
    blocksList.push(item);

    // add a node and connection to the graph
    if (config.graph.blocks[item]) {
      config.graph.blocks[item].push(file.path);
    } else {
      config.graph.blocks[item] = [];
      config.graph.blocks[item].push(file.path);
    }

    // is the block already exist?
    if (config.blocksFromHtml.indexOf(item) + 1) continue;
    // add class to the list
    config.blocksFromHtml.push(item);
  }

  if (config.logging) {
    console.log(
      `---------- Used HTML blocks on ${file.relative} (${blocksList.length}): ${blocksList.join(
        ", ",
      )}`,
    );
  }
}
