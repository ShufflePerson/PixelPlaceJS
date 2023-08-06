import initLogger from "./Logging/initLogger";
import EPackets from "./PixelPlace/Enums/EPackets";
import PixelPlace from "./PixelPlace/PixelPlace";
import World from "./PixelPlace/World/World";
import fs from "fs";
import Types from "./PixelPlace/Types/Types";
import packPixel from "./PixelPlace/World/Utils/packPixel";
import Utils from "./Utils";

export { World };
export { PixelPlace };
export { EPackets };
export { Types };
export { Utils };


initLogger();

if (require.main === module) {
  (async () => {
    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
    if (!fs.existsSync("./data")) fs.mkdirSync("./data");


    let world = new World(7);
    await world.Init();

    let pp = new PixelPlace([""], world, 7);
    await pp.Init();

    await pp.render.drawRect({
        x: 1276,
        y: 1242
    }, {
        x: 100,
        y: 100
    }, 5) 
    

    console.log("PP is running");
  })();
}
