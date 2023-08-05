function packPixel(buffer: Buffer, offset: number, x: number, y: number, color: number) {
  try {
    buffer.writeInt32BE((x << 20) | (y << 8) | color, offset);
  } catch (ex) {
    console.log(ex);
  }
}

export default packPixel;
