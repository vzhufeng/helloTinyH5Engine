import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

// node rollup -c -w
const isBuild = process.argv.length < 4 ? true : false;

export default {
  input: "./engine.js",
  output: [
    {
      file: pkg.umd,
      format: "umd",
      name: "tinyEngine",
      sourcemap: !isBuild
    },
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: !isBuild
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: !isBuild
    }
  ],
  plugins: [
    external(),
    postcss(),
    url(),
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"]
    }),
    resolve(),
    commonjs(),
    isBuild && terser()
  ]
};
