const desaturatePixel = require('../desaturate').desaturateBT601

/**
 * Desaturate a UInt8Array
 * @param {UInt8Array} buffer
 * @param {number} channels - 1-4
 */
const desaturate = (buffer, channels) => {
    const bufferLength = buffer.length
    const desaturatedBuffer = Buffer.alloc(bufferLength / channels)

    for (let i = 0, j = 0; i < bufferLength; i += channels) {
        j = desaturatedBuffer.writeUInt8(desaturatePixel(buffer[i], buffer[i + 1], buffer[i + 2]), j, true)
    }

    return desaturatedBuffer
}

module.exports = { desaturate }
