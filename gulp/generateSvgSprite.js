import fs from "fs";
import gulp from "gulp";
import cheerio from "gulp-cheerio";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import svgMin from "gulp-svgmin";
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
        svgMin(function () {
          return {
            multipass: true,
            plugins: [
              {
                cleanupIDs: { minify: true },
              },
              {
                name: "removeAttrs",
                params: {
                  attrs: "(height|width)",
                },
              },
              {
                removeViewBox: false,
              },
            ],
          };
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
