
function unpackPixel(pixel: number) {
    const x = (pixel >> 20) & 0xFFF;
    const y = (pixel >> 8) & 0xFFF;
    const color = pixel & 0xFF;

    return [x, y, color]
}

