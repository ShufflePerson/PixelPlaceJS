import winston from "winston";
import PixelPlace from "../PixelPlace";
import { EDrawingMode } from "./Enums/EDrawingMode";
import { convertAndGetImage } from "./Logic/Image/convertAndGetImage";
import drawBasic from "./Logic/Methods/drawBasic";
import getRect from "./Logic/Rect/getRect";
import IImageData from "./Types/IImageData";
import IVector2D from "./Types/IVector2D";

class Render {
  constructor(private pixelplace: PixelPlace) {}

  private async draw(imageData: IImageData, position: IVector2D, mode: EDrawingMode, forceOverride: boolean) {
    let { width, height } = imageData.metadata;

    switch (mode) {
      case EDrawingMode.BASIC:
        await drawBasic(position, width, height, imageData.buffer, forceOverride, this.pixelplace);
        break;

      default:
        winston.log("error", "Given Drawing Mode is not a valid option. ", "Render", mode);
        break;
    }
  }

  public async drawRect(
    position: IVector2D,
    size: IVector2D,
    color: number,
    protect: boolean = false,
    mode: EDrawingMode = EDrawingMode.BASIC,
    forceOverride: boolean = false
  ): Promise<IImageData> {
    let buffer = getRect(position, size, color);
    let imageData = {
      buffer,
      metadata: {
        width: size.x,
        height: size.y
      }
    };

    if (protect) {
      this.pixelplace.registerProtectionZone(position.x, position.y, imageData);
    }

    await this.draw(imageData, position, mode, forceOverride);

    return imageData;
  }

  public async drawImage(
    position: IVector2D,
    imagePath: string,
    size: number,
    protect: boolean = false,
    mode: EDrawingMode = EDrawingMode.BASIC,
    forceOverride: boolean = false
  ): Promise<number> {
    let imageData = await convertAndGetImage(imagePath, size);
    let protectId: number = -1;

    if (protect) {
      protectId = this.pixelplace.registerProtectionZone(position.x, position.y, imageData);
    }
    await this.draw(imageData, position, mode, forceOverride);

    return protectId;
  }
}

export default Render;
