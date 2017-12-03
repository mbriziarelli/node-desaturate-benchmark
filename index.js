const path = require('path')
const program = require('commander')

const { desaturate } = require("./desaturate");
const { benchmarkJimp } = require('./jimp')
// const { benchmarkSharp } = require('./sharp')
const { benchmarkJSMono } = require('./js-mono')
// const { benchmarkJSMulti } = require('./js-multi')
const { timerStart, timerEnd, displayTime } = require('./hr-timer')
const { IMAGE_FULL_PATH } = require('./image-load-save')

async function benchmark (benchCallback, iterations, name) {
  try {
    const nanoseconds = await benchCallback(IMAGE_FULL_PATH, iterations)

    displayTime(`${name} benchmark total time: `, nanoseconds)
    if (iterations > 1) {
      displayTime(`${name} benchmark mean iteration time: `, nanoseconds/iterations)
    }

  } catch (error) {
    if (error && error.message) {
      console.log(`${name} benchmark failed: ${error.message}`)
    } else {
      console.log(`${name} benchmark failed.`)
    }
  }
}

program
  .version('1.0.0')
  .option('-j, --jimp', 'Run the Jimp benchmark.')
  .option('-s, --sharp', 'Run the Sharp benchmark.')
  .option('-js, --javascript', 'Run the JavaScript benchmark.')
  .option('-m, --cluster', 'Run the JavaScript benchmark in cluster mode. No effect on other benchmarks.')
  .option('-i, --iterations <iterations>', 'The number of times a given benchmark should be run. Default to 1', 1)
  .parse(process.argv)

if (program.jimp) {
  benchmark(benchmarkJimp, program.iterations, 'Jimp')
} else if (program.sharp) {
  // benchmark(benchmarkSharp, program.iterations, 'Sharp')
} else if (program.javascript) {
  if (program.cluster) {
    // benchmark(benchmarkJSMulti, program.iterations, 'JavaScript Cluster')
  } else {
    benchmark(benchmarkJSMono, program.iterations, 'JavaScript')
  }
}
