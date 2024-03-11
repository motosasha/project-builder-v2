import path from "path";
import gulp from "gulp";
import browserSync from "browser-sync";
import debug from "gulp-debug";
import plumber from "gulp-plumber";
import csso from "gulp-csso";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import atImport from "postcss-import";
import * as nodeSass from "sass";
import autoprefixer from "autoprefixer";
import pxToRem from "postcss-pxtorem";
import sortMediaQueries from "postcss-sort-media-queries";
import replace from "postcss-replace";

import { fileURLToPath } from "url";
import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sass = gulpSass(nodeSass);
const { src, dest } = gulp;
const postCssPlugins = [
  autoprefixer({ grid: true }),
  pxToRem({
    rootValue: 16,
    unitPrecision: 5,
    propList: ["font", "font-size", "line-height", "letter-spacing"],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
  }),
  replace({
    commentsOnly: false,
    data: config.paths.style,
    pattern: "{{([^\\s]+?)}}",
  }),
  atImport(),
  sortMediaQueries({
    sort: config.strategy,
  }),
];

export function compileSass(cb) {
  const fileList = config.styleSheets;
  if (config.buildLibrary) fileList.push(`${config.from.library}/scss/library.scss`);

  if (fileList.length !== 0) {
    return src(fileList, { sourcemaps: true })
      .pipe(
        plumber({
          errorHandler: function (err) {
            console.log(err.message);
            this.emit("end");
          },
        }),
      )
      .pipe(debug({ title: "Compiles:" }))
      .pipe(sass({ includePaths: [__dirname + "/", "node_modules"] }, ""))
      .pipe(postcss(postCssPlugins))
      .pipe(
        csso({
          restructure: true,
          comments: false,
        }),
      )
      .pipe(plumber.stop())
      .pipe(dest(config.to.style, { sourcemaps: config.mode !== "production" ? "." : false }))
      .pipe(browserSync.stream());
  } else {
    cb?.();
  }
}
