import path from "path";
import ghPages from "gh-pages";

import { config } from "./config.js";

export function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), config.to.root), "", cb).then();
}
