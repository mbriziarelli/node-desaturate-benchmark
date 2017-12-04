const Jimp = require("jimp")
const path = require("path")
const fs = require('fs')

const { timerStart, timerEnd } = require("../hr-timer")
const timerDesc = "benchmarkJSWasm"

const instantiateWasm = () => {
  const wasmBytes = fs.readFileSync(path.resolve(__dirname, './program.wasm'))

  return WebAssembly
    .instantiate(wasmBytes)
    .then(results => results.instance.exports)
}

/**
 * Desaturate a Buffer
 * @param {Buffer} srcBuffer
 * @param {Buffer} destBuffer
 * @param {number} channels - 1-4
 */
const desaturate = (srcBuffer, destBuffer, bufferLength, wasmExports) => {
    let i = 0
    const { desaturateRGBA } = wasmExports

    while (i < bufferLength) {
      i = destBuffer.writeUInt32BE(desaturateRGBA(srcBuffer.readUInt32BE(i, true)), i, true)
    }
}

/**
 * Benchmark image desaturation using Jimp JavaScript only library.
 * @param {string} imgPath
 * @param {number} iterations
 * @returns {Promise<number>}
 */
async function benchmarkJSWasm(imgPath, iterations) {
  try {
    const image = await Jimp.read(imgPath)
    const wasmExports = await instantiateWasm()
    const { data: srcBuffer, width, height } = image.bitmap
    const bufferLength = srcBuffer.length
    const destBuffer = Buffer.allocUnsafe(bufferLength)

    timerStart(timerDesc)
    for (let iter = 0; iter < iterations; iter++) {
      desaturate(srcBuffer, destBuffer, bufferLength, wasmExports)
    }
    let nanoseconds = timerEnd(timerDesc)

    image.bitmap.data = destBuffer
    image.write(path.resolve(__dirname, './desaturated.png'))

    return Promise.resolve(nanoseconds)
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = { benchmarkJSWasm }
