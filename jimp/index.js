const Jimp = require('jimp')
const path = require('path')

const { timerStart, timerEnd } = require('../hr-timer')
const timerDesc = 'benchmarkJimp'

/**
 * Benchmark image desaturation using Jimp JavaScript only library.
 * @param {string} imgPath 
 * @param {number} iterations 
 * @returns {Promise<number>}
 */
async function benchmarkJimp (imgPath, iterations) {
  try {
    const image = await Jimp.read(imgPath)
    let desaturatedImage

    timerStart(timerDesc)
    if (iterations === 1) {
      desaturatedImage = image.grayscale()
    } else for (let i = 0; i < iterations; i++) {
      desaturatedImage = image.clone().grayscale()
    }
    let nanoseconds = timerEnd(timerDesc)

    desaturatedImage.write(path.resolve(__dirname, 'desaturated.png'), () => {})

    return Promise.resolve(nanoseconds)
  } catch (error) {
    return Promise.resolve(error)
  }
}

module.exports = { benchmarkJimp }
