import gulp from "gulp";
import plumber from "gulp-plumber";
import jsonConcat from "gulp-json-concat";

import { config } from "./config.js";

const { src, dest } = gulp;

export function compileJson(cb) {
  const jsonList = `${config.from.data}/**/*.json`;
  if (jsonList) {
    return src(jsonList)
      .pipe(plumber())
      .pipe(
        jsonConcat("data.json", function (data) {
          return new Buffer.from(JSON.stringify(data));
        }),
      )
      .pipe(plumber.stop())
      .pipe(dest(`${config.from.json}`));
  } else {
    cb();
  }
}
