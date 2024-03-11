import cpy from "cpy";

import { config } from "./config.js";
import { fileExist } from "./utils/fileExist.js";

export function copySources(cb) {
  for (let source in config.sources) {
    let dest = config.sources[source][0];
    let isFlat = config.sources[source][1];
    cpy(source, dest, {
      filter: (file) => file.nameWithoutExtension !== ".gitkeep",
      flat: isFlat,
    });
  }
  cb();
}

export function copyBlockImg(cb) {
  config.blocksFromHtml.forEach(function (block) {
    let src = `${config.from.blocks}/${block}/img`;
    if (fileExist(src)) {
      if (fileExist(src)) {
        (async () => {
          if (config.isSeparatedBlockImg === "collected") {
            await cpy(`${src}/*.{${config.fileFormats}}`, `${config.to.img}/blocks/${block}`);
          } else if (config.isSeparatedBlockImg) {
            await cpy(`${src}/*.{${config.fileFormats}}`, `${config.to.img}/${block}`);
          } else {
            await cpy(`${src}/*.{${config.fileFormats}}`, `${config.to.img}`);
          }
          cb();
        })();
      }
    }
  });
  cb();
}
