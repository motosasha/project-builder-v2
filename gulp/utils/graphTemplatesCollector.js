import { config } from "../config.js";

/**
 * Add templates to graph
 * @param  {Object} file — file buffer
 */
export function graphTemplatesCollector(file) {
  const fileContent = file.contents.toString();
  const templateExtendLine = fileContent.match(config.templateRegexp);
  let templateFileName;

  if (templateExtendLine) {
    templateFileName = templateExtendLine.toString();
    if (config.graph.templates[templateFileName]) {
      config.graph.templates[templateFileName].push(file.path);
    } else {
      config.graph.templates[templateFileName] = [];
      config.graph.templates[templateFileName].push(file.path);
    }
  }
}
