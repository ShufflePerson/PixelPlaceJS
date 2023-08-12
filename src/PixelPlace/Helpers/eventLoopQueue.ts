function eventLoopQueue() {
  return new Promise((resolve, reject) =>
    setImmediate(() => {
      resolve(null);
    })
  );
}

export default eventLoopQueue;
