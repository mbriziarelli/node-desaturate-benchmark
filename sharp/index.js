const Sharp = require('sharp');
const path = require('path');

const { timerStart, timerEnd } = require('../hr-timer');

const timerDesc = 'benchmarkSharp';

/**
 * Benchmark image desaturation using Jimp JavaScript only library.
 * @param {string} imgPath
 * @param {number} iterations
 * @returns {Promise<number>}
 */
async function benchmarkSharp(imgPath, iterations) {
  try {
    const colorPalette = Sharp(imgPath);
    let desaturatedImage;

    timerStart(timerDesc);
    if (iterations === 1) {
      desaturatedImage = await colorPalette.greyscale();
    } else {
      for (let i = 0; i < iterations; i += 1) {
        desaturatedImage = await colorPalette.clone().greyscale();
      }
    }
    const nanoseconds = timerEnd(timerDesc);

    desaturatedImage
      .toFormat('png')
      .toFile(path.resolve(__dirname, './desaturated.png'));

    return Promise.resolve(nanoseconds);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = { benchmarkSharp };
