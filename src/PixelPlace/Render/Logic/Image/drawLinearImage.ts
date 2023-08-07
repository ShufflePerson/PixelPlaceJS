import sharp from "sharp";
import getPxPColor from "../../../Helpers/Render/getPxPColor";
import Bot from "../../../Bot/Bot";
import IVector2D from "../../Types/IVector2D";

export async function drawLinearImage(position: IVector2D, imagePath: string, size: number, bots: Bot[]): Promise<void> {
  const imageInfo = await sharp(imagePath).resize(size).raw().toBuffer({ resolveWithObject: true });

  const { data, info } = imageInfo;
  const { channels, width, height } = info;
  const pixelCount = width * height * channels;

  let currentX = position.x;
  let currentY = position.y;

  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += channels) {
    const alpha = data[pixelIndex + 3];

    if (alpha > 0.6) {
      const x = (pixelIndex / channels) % width;
      const y = Math.floor(pixelIndex / channels / width);

      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      let pixelPlaced = false;
      let pxpColor = getPxPColor(r, g, b);

      while (!pixelPlaced) {
        for (let bot of bots) {
          pixelPlaced = bot.placePixel(currentX + x, currentY + y, pxpColor);
          if (pixelPlaced) {
            break;
          }
        }
        await new Promise((resolve) => setImmediate(resolve));
      }
    }
  }
}
