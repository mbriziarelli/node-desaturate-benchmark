const path = require('path')
const cluster = require('cluster');
const os = require('os')

const DesaturationWorker = require('./js-multi/worker')
const { timerStart, timerEnd, displayTime } = require('./hr-timer')
const { LOAD_IMAGE, IMAGE_LOADED, PROCESS_CHUNK, CHUNK_PROCESSED, INIT } = require('./js-multi/messages')
const { waitOnline, waitImagesLoaded, waitChunksProcessed } = require('./js-multi/waiters')
const timerDesc = 'JavaScript Cluster'

if (cluster.isMaster) {

  const imagePath = path.resolve('./color-palette.png')
  const workers = os.cpus().map(() => cluster.fork())
  const chunksCount = workers.length

  waitOnline(workers)
    .then(() => {
      workers.forEach(worker => {
        worker.send({ type: LOAD_IMAGE, imagePath })
      })
      return waitImagesLoaded(workers)
    })
    .then(() => {
      timerStart(timerDesc)
      workers.forEach((worker, chunkIndex) => {
        worker.send({ type: PROCESS_CHUNK, chunkIndex, chunksCount })
      })
      return waitChunksProcessed(workers)
    })
    .then(processedChunks => {
      const nanoseconds = timerEnd(timerDesc)
      displayTime('JavaScript Cluster: ', nanoseconds)
    })

} else {

  const worker = new DesaturationWorker()

  process.on('message', (message) => {
    switch (message.type) {
      case LOAD_IMAGE:
        worker.loadImage(message.imagePath)
          .then(() => {
            process.send({ type: IMAGE_LOADED })
          })
          .catch(err => console.log(err))
        break
      case PROCESS_CHUNK:
        worker.processChunk(message.chunkIndex, message.chunksCount)
          .then(desaturatedBuffer => {
            process.send({ type: CHUNK_PROCESSED, desaturatedBuffer: desaturatedBuffer.toString('hex') })
          })
          .catch(err => console.log(err))
        break
      default:
        console.log(`Unknown message: ${message}`)
    }
  })
}
