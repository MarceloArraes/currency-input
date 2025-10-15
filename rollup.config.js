import svelte from "rollup-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import copy from "rollup-plugin-copy2"
import json from "rollup-plugin-json"
import postcss from "rollup-plugin-postcss"
import polyfill from "rollup-plugin-polyfill-node"
import tar from "tar"
import fs from "fs"
import crypto from "crypto"
import pkg from "./package.json"

const production = !process.env.ROLLUP_WATCH

// Custom plugin to add a hash to the schema.json
const hash = () => ({
  writeBundle() {
    const fileBuffer = fs.readFileSync("dist/plugin.min.js")
    const hashSum = crypto.createHash("sha1")
    hashSum.update(fileBuffer)
    const hex = hashSum.digest("hex")
    const schema = JSON.parse(fs.readFileSync("./dist/schema.json", "utf8"))
    const newSchema = { ...schema, hash: hex, version: pkg.version }
    fs.writeFileSync("./dist/schema.json", JSON.stringify(newSchema, null, 2))
  },
})

// Custom plugin to bundle the dist folder into a .tar.gz
const bundle = () => ({
  async writeBundle() {
    // Use an unscoped name for the bundle file
    const bundleName = `${pkg.name.split("/").pop()}-${pkg.version}.tar.gz`
    return tar
      .c({ gzip: true, cwd: "dist" }, [
        "plugin.min.js",
        "schema.json",
        "package.json",
      ])
      .pipe(fs.createWriteStream(`dist/${bundleName}`))
  },
})

export default {
  input: "index.js",
  output: {
    sourcemap: !production,
    format: "iife",
    file: "dist/plugin.min.js",
    name: "plugin",
  },
  plugins: [
    svelte({ emitCss: true }),
    postcss(),
    commonjs(),
    polyfill(),
    resolve({ preferBuiltins: true, browser: true }),
    json(),
    production && terser(),
    // This now ONLY copies the files into dist/ before they are hashed and bundled
    production && copy({ assets: ["schema.json", "package.json"] }),
    production && hash(),
    production && bundle(),
  ],
}