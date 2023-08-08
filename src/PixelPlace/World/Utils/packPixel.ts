import getPackedPixel from "./getPackedPixel";

function packPixel(buffer: Buffer, offset: number, x: number, y: number, color: number) {
  try {
    buffer.writeInt32BE(getPackedPixel(x, y, color), offset);
  } catch (ex) {
    console.log(ex);
  }
}

export default packPixel;
