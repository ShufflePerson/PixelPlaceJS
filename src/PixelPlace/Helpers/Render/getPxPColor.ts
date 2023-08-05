interface RgbColor {
  r: number;
  g: number;
  b: number;
}

let colors: any = {
  "#FFFFFF": 0,
  "#C4C4C4": 1,
  "#888888": 2,
  "#555555": 3,
  "#222222": 4,
  "#000000": 5,
  "#003638": 39,
  "#006600": 6,
  "#477050": 40,
  "#94E044": 10,
  "#98FB98": 41,
  "#FBFF5B": 11,
  "#E5D900": 12,
  "#E6BE0C": 13,
  "#E59500": 14,
  "#FF7000": 42,
  "#FF3904": 21,
  "#E50000": 20,
  "#CE2939": 43,
  "#FF416A": 44,
  "#9F0000": 19,
  "#6B0000": 18,
  "#FF755F": 23,
  "#A06A42": 15,
  "#633C1F": 17,
  "#99530D": 16,
  "#BB4F00": 22,
  "#FFC49F": 24,
  "#FFDFCC": 25,
  "#FFA7D1": 26,
  "#CF6EE4": 27,
  "#7D26CD": 45,
  "#EC08EC": 28,
  "#820080": 29,
  "#330077": 46,
  "#020763": 31,
  "#5100FF": 30,
  "#0000EA": 32,
  "#044BFF": 33,
  "#005BA1": 47,
  "#6583CF": 34,
  "#36BAFF": 35,
  "#0083C7": 36,
  "#00D3DD": 37,
  "#45FFC8": 38,
  "#B5E8EE": 48
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbDistance(rgb1: RgbColor, rgb2: RgbColor) {
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return dr * dr + dg * dg + db * db;
}

function findClosestHex(r: number, g: number, b: number, colorList: { [hex: string]: number }): string | null {
  const targetRgb = { r, g, b };
  let minDistance = Number.MAX_VALUE;
  let closestHex: string | null = null;

  for (const hex in colorList) {
    if (colorList.hasOwnProperty(hex)) {
      const distance = rgbDistance(targetRgb, hexToRgb(hex));
      if (distance < minDistance) {
        minDistance = distance;
        closestHex = hex;
      }
    }
  }

  return closestHex;
}

function rgbToHex(r: number, g: number, b: number) {
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function getPxPColor(r: number, g: number, b: number): number {
  let hex = `#${rgbToHex(r, g, b)}`.toUpperCase();
  if (colors[hex] != undefined) {
    return colors[hex];
  }
  let color = colors[findClosestHex(r, g, b, colors) || ""];

  colors[hex] = color;

  return color;
}

export default getPxPColor;
