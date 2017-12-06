const Jimp = require("jimp")
const path = require("path")
const fs = require('fs')

const wasmBytes = fs.readFileSync(path.resolve(__dirname, './program.wasm'))
const { timerStart, timerEnd } = require("../hr-timer")
const timerDesc = "benchmarkJSWasm"

const instantiateWasm = (options = {}) => {
  return WebAssembly
    .instantiate(wasmBytes, options)
    .then(results => results.instance.exports)
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
    const { data: srcBuffer, width, height } = image.bitmap
    const bufferLength = srcBuffer.length
    const channels = bufferLength / (width * height)
    const destBuffer = Buffer.allocUnsafe(bufferLength)

    const options = {
      env: {
        readUInt32: (index) => srcBuffer.readUInt32BE(index),
        writeUInt32: (value, index) => { destBuffer.writeUInt32BE(value, index, true) }
      }
    }

    const wasmExports = await instantiateWasm(options)
    const { desaturate } = wasmExports

    timerStart(timerDesc)
    for (let iter = 0; iter < iterations; iter++) {
      desaturate(bufferLength, channels)
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
