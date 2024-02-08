import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import { getDirectories } from "./utils/getDirectories.js";
import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeJsRequiresFile(cb) {
  const jsRequiresList = [];

  config.addJsBefore.forEach(function (src) {
    jsRequiresList.push(src);
  });
  const allBlocksWithJsFiles = getDirectories("js");
  allBlocksWithJsFiles.forEach(function (blockName) {
    if (config.alwaysAddBlocks.indexOf(blockName) === -1) return;
    jsRequiresList.push(`../blocks/${blockName}/${blockName}.js`);
  });
  allBlocksWithJsFiles.forEach(function (blockName) {
    let src = `../blocks/${blockName}/${blockName}.js`;
    const prefix = config.mode === "development" ? "dev" : "";
    const devJS = fs.existsSync(
      `${__dirname}/${config.from.blocks}/${blockName}/${prefix}.${blockName}.js`,
    );

    if (devJS === true && config.mode === "development") {
      src = `../blocks/${blockName}/${prefix}.${blockName}.js`;
    }

    if (config.blocksFromHtml.indexOf(blockName) === -1) return;
    if (jsRequiresList.indexOf(src) > -1) return;
    jsRequiresList.push(src);
  });
  config.addJsAfter.forEach(function (src) {
    jsRequiresList.push(src);
  });
  let msg = `\n/*!*${config.doNotEditMsg.replace(/\n /gm, "\n * ").replace(/\n\n$/, "\n */\n\n")}`;
  let jsRequires = msg + "/* global require */\n\n";
  jsRequiresList.forEach(function (src) {
    jsRequires += `require('${src}');\n`;
  });
  jsRequires += msg;
  fs.writeFileSync(`${config.from.js}/entry.js`, jsRequires);
  console.log("---------- Write new entry.js");
  cb();
}
