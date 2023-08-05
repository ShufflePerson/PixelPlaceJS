import initLogger from "./Logging/initLogger";
import EPackets from "./PixelPlace/Enums/EPackets";
import PixelPlace from "./PixelPlace/PixelPlace";
import World from "./PixelPlace/World/World";
import fs from "fs";
import Types from "./PixelPlace/Types/Types";

export { World };
export { PixelPlace };
export { EPackets };
export { Types };

if (require.main === module) {
  (async () => {
    if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
    if (!fs.existsSync("./data")) fs.mkdirSync("./data");

    initLogger();

    let world = new World(7);
    let pp = new PixelPlace(fs.readFileSync("./accounts.txt", "utf-8").split("\n"), world, 7);

    pp.render.drawRect(
      {
        x: 1234,
        y: 1234
      },
      {
        x: 100,
        y: 100
      },
      3
    );

    await world.Init();

    world.on(EPackets.NEW_CHAT_MESSAGE, (message: Types.Chat.ChatMessage) => {
      console.log(`${message.username}: ${message.message}`);
    });

    console.log("PP is running");
  })();
}
