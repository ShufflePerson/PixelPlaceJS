import sharp from "sharp";
import getPxPColor from "../../../Helpers/Render/getPxPColor";
import Bot from "../../../Bot/Bot";
import IVector2D from "../../Types/IVector2D";
import packPixel from "../../../World/Utils/packPixel";
import unpackPixel from "../../../World/Utils/unPackPixel";
import IImageData from "../../Types/IImageData";
import PixelPlace from "../../../PixelPlace";

export async function convertAndGetImage(position: IVector2D, imagePath: string, size: number, protect: boolean, pixelplace: PixelPlace): Promise<IImageData> {
  const imageInfo = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });

  const { data, info } = imageInfo;
  const { channels, width, height } = info;
  const pixelCount = width * height * channels;

  let imageBuffer: Buffer = Buffer.alloc(pixelCount * 4);


  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += channels) {
    const alpha = data[pixelIndex + 3];
    const x = (pixelIndex / channels) % width;
    const y = Math.floor(pixelIndex / channels / width);
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];

    let pxpColor = getPxPColor(r, g, b);
    packPixel(imageBuffer, (y * width + x) * 4, x, y, pxpColor);
  }

  let imageData: IImageData = {
    buffer: imageBuffer,
    metadata: {
      width,
      height
    }
  };

  if (protect) {
    pixelplace.RegisterProtectionZone(position.x, position.y, imageData);
  }

  return imageData;
}
