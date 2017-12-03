const Sharp = require('sharp')
const path = require('path')
const { timerStart, timerEnd } = require('../hr-timer')

const timerDesc = 'benchmarkSharp'

/**
 * Benchmark image desaturation using Jimp JavaScript only library.
 * @param {string} imgPath 
 * @param {number} iterations 
 * @returns {Promise<number>}
 */
function benchmarkSharp (imgPath, iterations) {
  return new Promise(resolve => {
    const colorPalette = Sharp(imgPath);
    let desaturatedImage, nanoseconds
  
    timerStart(timerDesc)
    if (iterations === 1) {
      desaturatedImage = colorPalette.greyscale()
    } else for (let i = 0; i < iterations; i++) {
      desaturatedImage = colorPalette.clone().greyscale()
    }
    nanoseconds = timerEnd(timerDesc)
    
    desaturatedImage
      .toFormat('png')
      .toFile(path.resolve(__dirname, './desaturated.png'))

    resolve(nanoseconds)
  })
}

module.exports = { benchmarkSharp }
