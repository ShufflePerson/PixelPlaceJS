import eventLoopQueue from "../PixelPlace/Helpers/eventLoopQueue";

async function sleep(ms: number) {
  let start = performance.now();
  while (performance.now() - start < ms) {
    await eventLoopQueue();
  }
}

export default sleep;
