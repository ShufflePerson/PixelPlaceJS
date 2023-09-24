import sleep from "../../../Utils/sleep";
import Bot from "../../Bot/Bot";
import eventLoopQueue from "../../Helpers/eventLoopQueue";

const TIME_BETWEEN_PIXEL_PLACES = 1;

export default async (x: number, y: number, color: number, bots: Bot[], force: boolean = false): Promise<boolean> => {
  let timeTillNextPixel = TIME_BETWEEN_PIXEL_PLACES;
  let succesful = true;
  for (let bot of bots) {
    if (timeTillNextPixel != -1) {
	timeTillNextPixel = bot.placePixel(x, y, color, force); 
    } 
  }

  if (timeTillNextPixel != -1 && timeTillNextPixel != -2) {
    succesful = false;
  }

  if (timeTillNextPixel == -1) {
    timeTillNextPixel = TIME_BETWEEN_PIXEL_PLACES;
  }
  if (timeTillNextPixel != -2) await sleep(5);

  return succesful;
};

