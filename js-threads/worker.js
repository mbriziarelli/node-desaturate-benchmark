const desaturateAverage = (r, g, b) => ((+r + +g + +b) / 3) | 0;
const desaturateLuma = (r, g, b) => (+r * 0.2126 + +g * 0.7152 + +b * 0.0722) | 0;
const desaturateBT601 = (r, g, b) => (+r * 0.299 + +g * 0.587 + +b * 0.114) | 0;
const desaturateMinMax = (r, g, b) => ((Math.min(+r, +g, +b) + Math.max(+r, +g, +b)) / 2) | 0;

const getDesaturator = (srcBuffer, destBuffer) => (index) => {
  const grey = desaturateBT601(srcBuffer[index], srcBuffer[index + 1], srcBuffer[index + 2]);
  index = destBuffer.writeUInt8(grey, index, true);
  index = destBuffer.writeUInt8(grey, index, true);
  index = destBuffer.writeUInt8(grey, index, true);
  return destBuffer.writeUInt8(srcBuffer[index], index, true);
};

/**
 * Desaturate a Buffer
 * @param {Buffer} srcBuffer
 * @param {Buffer} destBuffer
 * @param {number} bufferLength
 */
const desaturate = (srcBuffer, destBuffer, bufferLength) => {
  let i = 0;
  const desaturateUInt32 = getDesaturator(srcBuffer, destBuffer);

  while (i < bufferLength) {
    i = desaturateUInt32(i);
  }
};

onmessage = function (event) {
  const {
    id, srcBuffer, destBuffer, bufferLength,
  } = event.data;
  desaturate(srcBuffer, destBuffer, bufferLength);
  postMessage({ id });
};
