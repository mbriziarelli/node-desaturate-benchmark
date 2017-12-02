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
function benchmarkJimp (imgPath, iterations) {
  return Jimp
    .read(imgPath)
    .then(image => {
      let desaturatedImage

      timerStart(timerDesc)
      for (let i = 0; i < iterations; i++) {
        desaturatedImage = image.clone().grayscale()
      }
      let nanoseconds = timerEnd(timerDesc)
      desaturatedImage.write(path.resolve(__dirname, 'desaturated.png'), () => {})

      return nanoseconds
    })
}

module.exports = { benchmarkJimp }
