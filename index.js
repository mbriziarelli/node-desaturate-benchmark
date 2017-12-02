const path = require('path')

const { desaturate } = require("./desaturate");
const { benchmarkJimp } = require('./jimp')
const { benchmarkSharp } = require('./sharp')
const { benchmarkJSMono } = require('./js-mono')
const { benchmarkJSMulti } = require('./js-multi')
const { timerStart, timerEnd, displayTime } = require('./hr-timer')
const imageAbsolutePath = path.resolve('./color-palette.png')

function benchmark (benchCallback, iterations, name) {
  benchCallback(imageAbsolutePath, iterations)
    .then(nanoseconds => {
      displayTime(`${name} benchmark total time: `, nanoseconds)
      if (iterations > 1) {
        displayTime(`${name} benchmark mean iteration time: `, nanoseconds/iterations)
      }
    })
    .catch(err => {
      console.log(`${name} benchmark failed`, err ? err.message : '')
    })
}

function main(param) {
  switch (param) {
    case "--jimp":
      benchmark(benchmarkJimp, 10, 'Jimp')
      break
    case "--sharp":
      benchmark(benchmarkSharp, 10, 'Sharp')
      break
    case "--jsmono":
      benchmark(benchmarkJSMono, 100, 'JavaScript one thread')
      break
    case "--jsmulti":
      benchmark(benchmarkJSMulti, 1, 'JavaScript multi-thread')
      break
    default:
      console.log("bad parameter")
  }
}

main(process.argv[2])
