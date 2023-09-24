import getPxPColor from "./PixelPlace/Helpers/Render/getPxPColor";
import { getPalive } from "./PixelPlace/Helpers/getPalive";
import fetchCanvasPNG from "./PixelPlace/World/Utils/fetchCanvasPNG";
import packPixel from "./PixelPlace/World/Utils/packPixel";
import unpackPixel from "./PixelPlace/World/Utils/unpackPixel";

namespace Utils {
  export let generatePingAlive = getPalive;
  export let getColorFromRGB = getPxPColor;
  export let getLatestCanvasPNG = fetchCanvasPNG;
  
  export namespace Buffer {
    export function writeIntoBuffer(x: number, y: number, width: number, color: number, buffer: Buffer) {
      packPixel(buffer, (y * width + x) * 4, x, y, color);
    }
  
    export function readFromBuffer(x: number, y: number, width: number, buffer: Buffer) {
        return unpackPixel(buffer, (y * width + x) * 4);
    }
  }


}

export default Utils;
