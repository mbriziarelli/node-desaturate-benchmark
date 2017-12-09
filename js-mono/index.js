const Jimp = require("jimp")
const path = require("path")

const { timerStart, timerEnd } = require("../hr-timer")
const desaturateBT601 = require('../desaturate').desaturateBT601

const timerDesc = "benchmarkJSMono"

const getDesaturator = (srcBuffer, destBuffer) => (index) => {
  const grey = Math.imul(desaturateBT601(srcBuffer[index], srcBuffer[index + 1], srcBuffer[index + 2]), 1)
  index = destBuffer.writeUInt8(grey, index, true)
  index = destBuffer.writeUInt8(grey, index, true)
  index = destBuffer.writeUInt8(grey, index, true)
  return destBuffer.writeUInt8(srcBuffer[index], index, true)
}

/**
 * Desaturate a Buffer
 * @param {Buffer} srcBuffer
 * @param {Buffer} destBuffer
 * @param {number} channels - 1-4
 */
const desaturate = (srcBuffer, destBuffer, bufferLength) => {
    let i = 0, desaturateUInt32 = getDesaturator(srcBuffer, destBuffer)
    
    while (i < bufferLength) {
        i = desaturateUInt32(i)
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
