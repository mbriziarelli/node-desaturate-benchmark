const { NS_PER_SEC } = require('./constants');

const runningTimers = {};

function timerStart(timerDesc) {
  if (runningTimers[timerDesc]) {
    throw new Error(`"${timerDesc}" timer is already running.`);
  }
  runningTimers[timerDesc] = process.hrtime();
}

function timerEnd(timerDesc) {
  if (!runningTimers[timerDesc]) {
    throw new Error(`"${timerDesc}" timer doesn't exists.`);
  }
  const diff = process.hrtime(runningTimers[timerDesc]);

  delete runningTimers[timerDesc];

  const nanoseconds = (diff[0] * NS_PER_SEC) + diff[1];
  return nanoseconds;
}

module.exports = {
  timerStart,
  timerEnd,
};
