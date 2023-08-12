import sleep from "../../../Utils/sleep";
import Bot from "../../Bot/Bot";
import eventLoopQueue from "../../Helpers/eventLoopQueue";

export default async (x: number, y: number, color: number, bots: Bot[], force: boolean = false): Promise<boolean> => {
  let timeTillNextPixel = 20;
  let succesful = true;
  for (let bot of bots) {
    if (timeTillNextPixel != -1) timeTillNextPixel = bot.placePixel(x, y, color, force);
  }

  if (timeTillNextPixel != -1 && timeTillNextPixel != -2) {
    succesful = false;
  }

  if (timeTillNextPixel == -1) {
    timeTillNextPixel = 20;
  }
  if (timeTillNextPixel != -2) await sleep(timeTillNextPixel);
  await eventLoopQueue();

  return succesful;
};
