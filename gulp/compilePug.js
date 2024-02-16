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
const {
  buildLibrary: library,
  isProjectNav: nav,
  paths: { pug: pugPaths },
  deployUrl,
} = config;

export function compilePug(pagesList) {
  if (config.buildLibrary) pagesList.push(`${config.from.library}/library.pug`);
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
        data: { pugPaths, nav, library, deployUrl },
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
  if (config.buildLibrary) pagesList.push(`${config.from.library}/library.pug`);
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
        data: { pugPaths, nav, library, deployUrl },
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
  if (config.buildLibrary) pagesList.push(`${config.from.library}/library.pug`);
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
        data: { pugPaths, nav, library, deployUrl },
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: "Compiled page(s)" }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}
