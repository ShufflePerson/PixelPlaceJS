import getPxPColor from "./PixelPlace/Helpers/Render/getPxPColor";
import { getPalive } from "./PixelPlace/Helpers/getPAlive";
import fetchCanvasPNG from "./PixelPlace/World/Utils/fetchCanvasPNG";


namespace Utils {
    export let generatePingAlive = getPalive;
    export let getColorFromRGB = getPxPColor;
    export let getLatestCanvasPNG = fetchCanvasPNG;
}

export default Utils;