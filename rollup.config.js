// rollup.config.js

import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import copy2 from "rollup-plugin-copy2"
import json from "@rollup/plugin-json"
import postcss from "rollup-plugin-postcss"
import polyfill from "rollup-plugin-polyfill-node"
import pkg from "./package.json"

const production = !process.env.ROLLUP_WATCH

// --- THIS IS THE SECTION TO CHANGE ---
// The original line was likely: const name = pkg.name
const name = pkg.name.replace("/", "-") // Replace the slash with a dash

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
    svelte({
      emitCss: true,
    }),
    postcss({
      extract: "bundle.css",
      sourceMap: !production,
      minimize: production,
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
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
  watch: {
    clearScreen: false,
  },
}