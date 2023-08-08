import axios from "axios";

async function fetchCanvasPNG(boardId: number): Promise<Buffer> {
  let currentTime: number = new Date().getTime();
  let url: string = `https://pixelplace.io/canvas/${boardId}.png?t200000=${currentTime.toString()}`;
  const buffer = (await axios({ url: url, responseType: "arraybuffer" })).data as Buffer;

  return buffer;
}

export default fetchCanvasPNG;
