function packPixel(buffer: Buffer, offset: number, x: number, y: number, color: number) {
    buffer.writeInt32BE((x << 20) | (y << 8) | color, offset);
}

export default packPixel;