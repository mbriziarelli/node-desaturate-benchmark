const Sharp = require('sharp')
const { timerEnd, timerStart, displayTime } = require('../hr-timer')
const desaturatePixel = require('../desaturate').desaturateBT601

class DesaturationWorker {
  constructor () {
    this.imageBuffer = null
    this.width = 0
    this.height = 0
    this.channels = 0
  }

  loadImage(imagePath) {
    return new Promise(async (resolve, reject) => {
      try {
        const image = await Sharp(imagePath).raw()
        const metadata = await image.metadata()
        
        this.imageBuffer = await image.toBuffer()
        this.width = metadata.width
        this.height = metadata.height
        this.channels = metadata.channels
            
        resolve()
      }
      catch(error) {
        console.log(error)
        this.imageBuffer = null
        this.width = 0
        this.height = 0
        this.channels = 0
  
        reject(error)
      }
    })
  }

  getBounds(chunkIndex, chunksCount) {
    if (this.imageBuffer) {
      const bufferLength = this.imageBuffer.length
      const pixelsCount = bufferLength / this.channels
      const chunkLength = Math.floor(pixelsCount / chunksCount) * this.channels
      const startOffset = chunkIndex * chunkLength
      const endOffset = chunkIndex === chunksCount - 1
        ? bufferLength
        : startOffset + chunkLength
      const desaturatedBufferLength = (endOffset - startOffset) / this.channels

      return { startOffset, endOffset, desaturatedBufferLength }
    }
  }

  processChunk(chunkIndex, chunksCount) {
    return new Promise((resolve, reject) => {
      if (this.imageBuffer) {
        const { startOffset, endOffset, desaturatedBufferLength } = this.getBounds(chunkIndex, chunksCount)
        const desaturatedBuffer = Buffer.alloc(desaturatedBufferLength)
        const timerDesc = `worker: ${chunkIndex}`
        const iterations = 50

        let desaturatedPixel

        timerStart(timerDesc)
        for (let iter = 0; iter < iterations; iter++) {
          for (let i = startOffset, j = 0; i < endOffset; i += this.channels) {
            desaturatedPixel = desaturatePixel(this.imageBuffer[i], this.imageBuffer[i + 1], this.imageBuffer[i + 2])
            j = desaturatedBuffer.writeUInt8(desaturatedPixel, j, true)
          }
        }
        displayTime(`Worker ${chunkIndex} time: `, timerEnd(timerDesc)/iterations)

        resolve(desaturatedBuffer)
      } else {
        reject(new Error('No image to process.'))
      }
    })
  }
}

module.exports = DesaturationWorker
