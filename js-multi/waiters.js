const {
  IMAGE_LOADED, CHUNK_PROCESSED,
} = require('./messages');

function waitSingleOnline(worker) {
  return new Promise((resolve) => {
    worker.on('online', () => { resolve(); });
  });
}

function waitOnline(workers) {
  const promises = workers.map(waitSingleOnline);
  return Promise.all(promises);
}

function waitSingleImageLoaded(worker) {
  return new Promise((resolve) => {
    worker.on('message', (message) => {
      if (message.type === IMAGE_LOADED) {
        resolve();
      }
    });
  });
}

function waitImagesLoaded(workers) {
  const promises = workers.map(waitSingleImageLoaded);
  return Promise.all(promises);
}

function waitSingleChunkProcessed(worker) {
  return new Promise((resolve) => {
    worker.on('message', (message) => {
      if (message.type === CHUNK_PROCESSED) {
        resolve(message.desaturatedBuffer.data);
      }
    });
  });
}

function waitChunksProcessed(workers) {
  const promises = workers.map(waitSingleChunkProcessed);
  return Promise.all(promises);
}

module.exports = {
  waitOnline,
  waitImagesLoaded,
  waitChunksProcessed,
};
