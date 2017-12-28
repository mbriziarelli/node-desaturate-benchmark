const { NS_PER_SEC, NS_PER_MS, NS_PER_MICRO } = require('./constants');

function formatTime(nanoseconds) {
  if (nanoseconds >= NS_PER_SEC) { return `${(nanoseconds / NS_PER_SEC).toFixed(3)}s`; }
  if (nanoseconds >= NS_PER_MS) { return `${(nanoseconds / NS_PER_MS).toFixed(3)}ms`; }
  if (nanoseconds >= NS_PER_MICRO) { return `${(nanoseconds / NS_PER_MICRO).toFixed(3)}μs`; }

  return `${nanoseconds.toFixed(3)}ns`;
}

function displayTime(timerDesc, nanoseconds) {
  console.log(`${timerDesc}${formatTime(nanoseconds)}`);
}

module.exports = {
  displayTime,
};
