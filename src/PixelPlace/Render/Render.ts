import winston from "winston";
import Bot from "../Bot/Bot";
import PixelPlace from "../PixelPlace";
import unpackPixel from "../World/Utils/unPackPixel";
import { EDrawingMode } from "./Enums/EDrawingMode";
import { convertAndGetImage } from "./Logic/Image/convertAndGetImage";
import drawBasic from "./Logic/Methods/drawBasic";
import getRect from "./Logic/Rect/getRect";
import IImageData from "./Types/IImageData";
import IVector2D from "./Types/IVector2D";
import packPixel from "../World/Utils/packPixel";
import getPackedPixel from "../World/Utils/getPackedPixel";

class Render {
  constructor(private pixelplace: PixelPlace) { }

  private async draw(imageData: IImageData, position: IVector2D, mode: EDrawingMode) {
    let { width, height } = imageData.metadata;

    switch (mode) {
      case EDrawingMode.BASIC:
          await drawBasic(position, width, height, imageData.buffer, this.pixelplace);
        break;
    
      default:
        winston.log("error", "Given Drawing Mode is not a valid option. ", "Render", mode);
        break;
    }
  }

  public async drawRect(position: IVector2D, size: IVector2D, color: number, protect: boolean = false, mode: EDrawingMode = EDrawingMode.BASIC): Promise<IImageData> {
    let buffer = getRect(position, size, color);
    let imageData = {
      buffer,
      metadata: {
        width: size.x,
        height: size.y
      }
    }

    if (protect) {
      this.pixelplace.RegisterProtectionZone(position.x, position.y, imageData);
    }


    await this.draw(imageData, position, mode);


    return imageData;
  }

  public async drawImage(position: IVector2D, imagePath: string, size: number, protect: boolean = false, mode: EDrawingMode = EDrawingMode.BASIC): Promise<IImageData> {
    let imageData = await convertAndGetImage(imagePath, size);
    
    if (protect) {
      this.pixelplace.RegisterProtectionZone(position.x, position.y, imageData);
    }

    await this.draw(imageData, position, mode);

    return imageData;
  }

}

export default Render;
