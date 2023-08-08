function getPackedPixel(x: number, y: number, color: number) {
  return (x << 20) | (y << 8) | color;
}

export default getPackedPixel;
