const Jimp = require("jimp")
const path = require("path")

const { timerStart, timerEnd } = require("../hr-timer")
const desaturatePixel = require('../desaturate').desaturateBT601

const timerDesc = "benchmarkJSMono"

/**
 * Desaturate a Buffer
 * @param {Buffer} srcBuffer
 * @param {Buffer} destBuffer
 * @param {number} channels - 1-4
 */
const desaturate = (srcBuffer, destBuffer, bufferLength) => {
    let i = 0, grey

    while (i < bufferLength) {
        grey = Math.imul(desaturatePixel(srcBuffer[i], srcBuffer[i + 1], srcBuffer[i + 2]), 1)
        i = destBuffer.writeUInt8(grey, i, true)
        i = destBuffer.writeUInt8(grey, i, true)
        i = destBuffer.writeUInt8(grey, i, true)
        i = destBuffer.writeUInt8(srcBuffer[i], i, true)
    }
}

/**
 * Benchmark image desaturation using Jimp JavaScript only library.
 * @param {string} imgPath
 * @param {number} iterations
 * @returns {Promise<number>}
 */
async function benchmarkJSMono(imgPath, iterations) {
  try {
    const image = await Jimp.read(imgPath)
    const { data: srcBuffer, width, height } = image.bitmap
    const bufferLength = srcBuffer.length
    const destBuffer = Buffer.allocUnsafe(bufferLength)

    timerStart(timerDesc)
    for (let iter = 0; iter < iterations; iter++) {
      desaturate(srcBuffer, destBuffer, bufferLength)
    }
    let nanoseconds = timerEnd(timerDesc)

    image.bitmap.data = destBuffer
    image.write(path.resolve(__dirname, './desaturated.png'))

    return Promise.resolve(nanoseconds)
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = { benchmarkJSMono }
