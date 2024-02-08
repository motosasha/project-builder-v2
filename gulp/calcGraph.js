import gulp from "gulp";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import through2 from "through2";

import { config } from "./config.js";
import { classCollector } from "./utils/classCollector.js";
import { graphBlocksCollector } from "./utils/graphBlocksCollector.js";
import { graphTemplatesCollector } from "./utils/graphTemplatesCollector.js";

const { src, lastRun } = gulp;

export function calcGraph() {
  const pagesList = [
    `${config.from.pages}/**/*.pug`,
    `${config.from.blocks}/**/*.pug`,
    `${config.from.templates}/**/*.pug`,
    `!${config.from.templates}/mixins.pug`,
  ];

  return src(pagesList, { since: lastRun(calcGraph) })
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Сборка графа",
            message: err.message,
          };
        }),
      }),
    )
    .pipe(through2.obj(generateGraph, "", ""))
    .pipe(plumber.stop());
}

function generateGraph(file, enc, cb) {
  if (file.isNull()) {
    cb(null, file);
    return;
  }
  // Checking whether the file being processed is an exception
  let processThisFile = true;
  config.notGetBlocks.forEach(function (item) {
    if (file.relative.trim() === item.trim()) processThisFile = false;
  });
  // The file is not excluded from processing, let's go...
  if (processThisFile) {
    const classesInFile = classCollector(file);

    // Traversing the found classes and adding the class to the graph
    graphBlocksCollector(classesInFile, file);
  }

  // Add templates to graph
  graphTemplatesCollector(file);

  cb();
}
