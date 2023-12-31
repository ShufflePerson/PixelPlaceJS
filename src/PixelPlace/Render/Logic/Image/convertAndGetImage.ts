import sharp from "sharp";
import getPxPColor from "../../../Helpers/Render/getPxPColor";
import Bot from "../../../Bot/Bot";
import IVector2D from "../../Types/IVector2D";
import packPixel from "../../../World/Utils/packPixel";
import unpackPixel from "../../../World/Utils/unpackPixel";
import IImageData from "../../Types/IImageData";
import PixelPlace from "../../../PixelPlace";

export async function convertAndGetImage(imagePath: string, size: number = 0): Promise<IImageData> {
  let resizeOptions: sharp.ResizeOptions = {
    kernel: "nearest"
  };
  let imageSharp = sharp(imagePath);
  if (size != 0) imageSharp = imageSharp.resize(size, undefined, resizeOptions);
  const imageInfo = await imageSharp.raw().toBuffer({ resolveWithObject: true });
  const { data, info } = imageInfo;
  const { channels, width, height } = info;
  const pixelCount = width * height * channels;
  let imageBuffer: Buffer = Buffer.alloc(pixelCount * 4);

  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += channels) {
    const x = (pixelIndex / channels) % width;
    const y = Math.floor(pixelIndex / channels / width);

    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    const alpha = data[pixelIndex + 3];
    let pxpColor = 63;

    if (alpha >= 0.5)
      pxpColor = getPxPColor(r, g, b)
    packPixel(imageBuffer, (y * width + x) * 4, x, y, pxpColor);
  }

  let imageData: IImageData = {
    buffer: imageBuffer,
    metadata: {
      width,
      height
    }
  };

  return imageData;
}
