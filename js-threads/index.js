const Jimp = require('jimp');
const path = require('path');
const Threads = require('webworker-threads');

// const desaturationWorker = new Threads.Worker(path.resolve(__dirname, 'worker.js'))
const { timerStart, timerEnd } = require('../hr-timer');

const timerDesc = 'benchmarkJSThread';

const desaturate = (srcBuffer, destBuffer, bufferLength) => new Promise((resolve) => {
  desaturationWorker.onmessage = () => {
    resolve();
  };
  desaturationWorker.postMessage({
    id: 0, srcBuffer, destBuffer, bufferLength,
  });
});

/**
 *
 * @param {Buffer} imageBuffer
 * @param {number} height
 */
const getLineReader = (imageBuffer, height) => {
  const lineBufferLength = imageBuffer.length / height;

  /**
   * @param {number} lineNumber
   */
  const readLine = (lineNumber) => {
    const start = lineNumber * lineBufferLength;
    const end = start + lineBufferLength;
    return imageBuffer.slice(start, end);
  };

  return readLine;
};

const getLineWriter = (imageBuffer, height) => {
  const lineBufferLength = imageBuffer.length / height;

  return (lineBuffer, lineNumber) => {

  };
};

/**
 * Benchmark image desaturation using Jimp JavaScript only library.
 * @param {string} imgPath
 * @param {number} iterations
 * @returns {Promise<number>}
 */
async function benchmarkJSThreads(imgPath, iterations) {
  try {
    const image = await Jimp.read(imgPath);
    const { data: srcBuffer } = image.bitmap;
    const bufferLength = srcBuffer.length;
    const destBuffer = Buffer.allocUnsafe(bufferLength);

    timerStart(timerDesc);
    for (let iter = 0; iter < iterations; iter += 1) {
      srcBuffer.toString('binary');
      destBuffer.toString('binary');
    }
    const nanoseconds = timerEnd(timerDesc);

    // image.bitmap.data = destBuffer
    // image.write(path.resolve(__dirname, './desaturated.png'))

    return Promise.resolve(nanoseconds);
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = { benchmarkJSThreads };
