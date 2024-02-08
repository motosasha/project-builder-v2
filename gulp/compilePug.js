import gulp from "gulp";
import pug from "gulp-pug";
import debug from "gulp-debug";
import newer from "gulp-newer";
import plumber from "gulp-plumber";
import prettyHtml from "gulp-pretty-html";
import notify from "gulp-notify";
import fs from "fs";

import { config } from "./config.js";

const { src, dest, lastRun } = gulp;
const nav = config.isProjectNav;
const pugPaths = config.paths;

export function compilePug(pagesList) {
  return src(pagesList)
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Сборка разметки",
            message: err.message,
          };
        }),
      }),
    )
    .pipe(
      pug({
        data: { pugPaths, nav },
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: "Compiled page(s)" }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}

export function recompilePug() {
  const pagesList = [`${config.from.pages}/**/*.pug`];
  return src(pagesList)
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Сборка разметки",
            message: err.message,
          };
        }),
      }),
    )
    .pipe(
      pug({
        data: { pugPaths, nav },
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: "Compiled page(s)" }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}

export function compilePugFast() {
  const pagesList = [`${config.from.pages}/**/*.pug`];
  return src(pagesList, { since: lastRun(compilePugFast) })
    .pipe(newer(config.to.pages))
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Сборка разметки",
            message: err.message,
          };
        }),
      }),
    )
    .pipe(
      pug({
        data: { pugPaths, nav },
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: "Compiled page(s)" }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}
