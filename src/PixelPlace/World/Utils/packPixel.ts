

function packPixel(x: number, y: number, color: number): number {
    return (x << 20) | (y << 8) | color;
}