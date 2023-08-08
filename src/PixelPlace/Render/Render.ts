import winston from "winston";
import Bot from "../Bot/Bot";
import PixelPlace from "../PixelPlace";
import unpackPixel from "../World/Utils/unPackPixel";
import { EDrawingMode } from "./Enums/EDrawingMode";
import { convertAndGetImage } from "./Logic/Image/convertAndGetImage";
import drawBasic from "./Logic/Methods/drawBasic";
import drawRectLinear from "./Logic/Rect/drawLinearRect";
import IImageData from "./Types/IImageData";
import IVector2D from "./Types/IVector2D";

class Render {
  constructor(private pixelplace: PixelPlace) { }

  public async drawRect(position: IVector2D, size: IVector2D, color: number): Promise<void> {
    return drawRectLinear(position, size, color, this.pixelplace.bots);
  }

  public async drawImage(position: IVector2D, imagePath: string, size: number, protect: boolean = false, mode: EDrawingMode = EDrawingMode.BASIC): Promise<IImageData> {
    let imageData = await convertAndGetImage(position, imagePath, size, protect, this.pixelplace);
    let { width, height } = imageData.metadata;

    if (protect) {
      this.pixelplace.RegisterProtectionZone(position.x, position.y, imageData);
    }

    switch (mode) {
      case EDrawingMode.BASIC:
          await drawBasic(position, width, height, imageData.buffer, this.pixelplace);
        break;
    
      default:
        winston.log("error", "Given Drawing Mode is not a valid option. ", "Render", mode);
        break;
    }

    return imageData;
  }

}

export default Render;
