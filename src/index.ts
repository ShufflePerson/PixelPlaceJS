import initLogger from "./Logging/initLogger";
import PixelPlace from "./PixelPlace/PixelPlace"
import World from "./PixelPlace/World/World";


(async () => {

    initLogger();

    let world = new World(11);
    await world.Init();

   // let pp = new PixelPlace(["eurachhomd.wao.c.2.0.44@gmail.com"], 11);
   // await pp.Init();

    console.log("PP is running")
})()