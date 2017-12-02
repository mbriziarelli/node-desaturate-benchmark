const desaturateAverage = (r, g, b) => (r + g + b) / 3
const desaturateLuma = (r, g, b) => r * 0.2126 + g * 0.7152 + b * 0.0722
const desaturateBT601 = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114
const desaturateMinMax = (r, g, b) => (Math.min(r, g, b) + Math.max(r, g, b)) / 2

module.exports = {
  desaturateAverage,
  desaturateLuma,
  desaturateBT601,
  desaturateMinMax
}
