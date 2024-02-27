import fs from "fs";

import { config } from "./config.js";
import { getDirectories } from "./utils/getDirectories.js";

export function writePugMixinsFile(cb) {
  let allBlocksWithPugFiles = getDirectories("pug");
  let pugMixins = "//-" + config.doNotEditMsg.replace(/\n /gm, "\n  ");
  allBlocksWithPugFiles.forEach(function (blockName) {
    pugMixins += `include ${config.from.blocks.replace(
      config.from.root,
      "..",
    )}/${blockName}/${blockName}.pug\n`;
  });
  fs.writeFileSync(`${config.from.templates}/mixins.pug`, pugMixins);
  cb?.();
}
