const path = require('path')
const Sharp = require('sharp')
const { timerStart, timerEnd } = require('../hr-timer')
const { desaturate } = require('./desaturate')

const timerDesc = "benchmarkJSMono"

async function benchmarkJSMono (imagePath, iterations) {
  const image = Sharp(imagePath)
  const { width, height, channels } = await image.metadata()
  const buffer = await image.raw().toBuffer()
  let desaturatedBuffer, nanoseconds

  timerStart(timerDesc)
  for (let i = 0; i < iterations; i++) {
    desaturatedBuffer = desaturate(buffer, channels)
  }
  nanoseconds = timerEnd(timerDesc)

  await Sharp(desaturatedBuffer, { raw: { width, height, channels: 1 }})
    .png()
    .toFile(path.resolve(__dirname, 'desaturated.png'))

  return Promise.resolve(nanoseconds)
}

module.exports = {
  benchmarkJSMono
}
