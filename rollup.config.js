import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
// We have removed copy2
import json from "@rollup/plugin-json"
import postcss from "rollup-plugin-postcss"
import polyfill from "rollup-plugin-polyfill-node"

const production = !process.env.ROLLUP_WATCH

// We have removed the 'const name = ...' line

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
    // We have removed the entire 'copy2' section from this array
  ],
  watch: {
    clearScreen: false,
  },
}