import initLogger from "./Logging/initLogger";
import EPackets from "./PixelPlace/Enums/EPackets";
import PixelPlace from "./PixelPlace/PixelPlace";
import IChatMessage from "./PixelPlace/Types/Chat/IChatMessage";
import World from "./PixelPlace/World/World";
import fs from 'fs';
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import IFight from "./PixelPlace/Types/Misc/Fight/IFight";
import Bot from "./PixelPlace/Bot/Bot";
import Auth from "./PixelPlace/Bot/Auth/Auth";

export { World };
export { PixelPlace };
export { EPackets }
export { IChatMessage }


if (require.main === module) {
    (async () => {
        if(!fs.existsSync("./temp")) fs.mkdirSync("./temp");
        if(!fs.existsSync("./data")) fs.mkdirSync("./data");

        initLogger();
    
        let world = new World(7);
        let pp = new PixelPlace(fs.readFileSync("./accounts.txt", "utf-8").split("\n"), world, 7);

        await world.Init();

        console.log("PP is running")
    })()
}
