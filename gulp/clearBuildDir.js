import { config } from "./config.js";
import { deleteAsync } from "del";

export function clearBuildDir() {
  return deleteAsync([`${config.to.root}/**/*`, `!${config.to.root}/readme.md`]);
}
