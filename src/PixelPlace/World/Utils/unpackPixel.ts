function unpackPixel(buffer: Buffer, offset: number) {
  const pixelValue = buffer.readInt32BE(offset);
  const x = (pixelValue >> 20) & 0xfff;
  const y = (pixelValue >> 8) & 0xfff;
  const color = pixelValue & 0xff;

  return [x, y, color];
}

export default unpackPixel;
