import resolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import multi from "@rollup/plugin-multi-entry";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

import { rollup } from "rollup";
import { config } from "./config.js";

export function compileJs() {
  const babelConfig = {
    babelHelpers: "runtime",
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-runtime"],
    exclude: ["**/node_modules/**"],
  };

  return rollup({
    input: `${config.from.js}/entry.js`,
    plugins: [
      multi(),
      resolve(),
      rollupReplace({
        preventAssignment: true,
        values: {
          "process.env.NODE_ENV": config.mode,
        },
      }),
      config.mode !== "development" && terser(),
      babel(babelConfig),
      commonjs(),
    ],
  }).then((bundle) => {
    return bundle.write({
      file: `${config.to.js}/bundle.js`,
      format: "esm",
      name: "bundle",
      sourcemap: config.mode === "development",
    });
  });
}
