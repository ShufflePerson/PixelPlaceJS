import PixelPlace from "../../../PixelPlace";
import unpackPixel from "../../../World/Utils/unPackPixel";
import IVector2D from "../../Types/IVector2D";

export default async (position: IVector2D, width: number, height: number, buffer: Buffer, forceOverride: boolean, pixelplace: PixelPlace): Promise<void> => {
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      let pixel = unpackPixel(buffer, (h * width + w) * 4);
      let [x, y, color] = pixel;
      await pixelplace.placePixel(position.x + x, position.y + y, color, forceOverride);
    }
    await new Promise((resolve) => setImmediate(resolve));
  }
};
