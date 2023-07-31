
function unpackPixel(buffer: Buffer, offset: number) {
    const pixelValue = buffer.readInt32BE(offset);
    const x = (pixelValue >> 20) & 0xFFF;
    const y = (pixelValue >> 8) & 0xFFF;
    const color = pixelValue & 0xFF;

    return [x, y, color]
}

export default unpackPixel;