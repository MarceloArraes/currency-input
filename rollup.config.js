import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import copy2 from "rollup-plugin-copy2" // It needs this
import json from "@rollup/plugin-json"
import postcss from "rollup-plugin-postcss"
import polyfill from "rollup-plugin-polyfill-node"
import pkg from "./package.json"

const production = !process.env.ROLLUP_WATCH
const name = pkg.name // This now works because pkg.name has no "/"

export default {
  input: "index.js",
  output: {
    sourcemap: !production,
    format: "iife",
    name: "plugin",
    file: "dist/plugin.min.js",
  },
  plugins: [
    json(),
    svelte({ emitCss: true }),
    postcss({
      extract: "bundle.css",
      sourceMap: !production,
      minimize: production,
    }),
    resolve({ browser: true, dedupe: ["svelte"] }),
    commonjs(),
    polyfill(),
    production && terser(),
    production &&
      copy2({
        assets: [
          ["package.json", `dist/${name}-${pkg.version}.tar.gz`],
          "schema.json",
        ],
      }),
  ],
  watch: { clearScreen: false },
}