import fs from "fs";
import gulp from "gulp";
import cheerio from "gulp-cheerio";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import svgo from "gulp-svgo";
import svgStore from "gulp-svgstore";

import { config } from "./config.js";
import { fileExist } from "./utils/fileExist.js";

const { src, dest } = gulp;

export function generateSvgSprite(cb) {
  let spriteSvgSymbols = [];
  let spriteSvgPath = `${config.from.symbols}`;
  config.blocksFromHtml.forEach(function (block) {
    let src = `${config.from.blocks}/${block}/symbols`;
    if (fileExist(src)) spriteSvgSymbols.push(`${src}/*.svg`);
  });
  if (fileExist(spriteSvgPath)) spriteSvgSymbols.push(`${spriteSvgPath}/*.svg`);
  if (spriteSvgSymbols.length) {
    return src(spriteSvgSymbols)
      .pipe(
        plumber({
          errorHandler: function (err) {
            console.log(err.message);
            this.emit("end");
          },
        }),
      )
      .pipe(
        svgo({
          multipass: true,
          plugins: [
            {
              cleanupIDs: { minify: true },
            },
            {
              removeAttrs: {
                attrs: config.removeSvgAttr,
                elemSeparator: ":",
                preserveCurrentColor: true,
              },
            },
            {
              removeViewBox: false,
            },
          ],
        }),
      )
      .pipe(svgStore({ inlineSvg: true }))
      .pipe(
        cheerio({
          run: function ($) {
            try {
              const svgAsBg = fs.readFileSync(`${config.from.symbols}/svgAsBg.xml`, "utf8");
              $("svg").append(svgAsBg.replace(/\n/g, ""));
            } catch (err) {
              /**/
            }
          },
          parserOptions: { xmlMode: true },
        }),
      )
      .pipe(rename("svgSprite.svg"))
      .pipe(plumber.stop())
      .pipe(dest(config.to.img));
  } else {
    cb();
  }
}
