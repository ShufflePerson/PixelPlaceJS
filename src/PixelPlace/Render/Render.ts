import Bot from "../Bot/Bot";
import PixelPlace from "../PixelPlace";
import { drawLinearImage } from "./Logic/Image/drawLinearImage";
import drawRectLinear from "./Logic/Rect/drawLinearRect";
import IImageData from "./Types/IImageData";
import IVector2D from "./Types/IVector2D";

class Render {
  constructor(private pixelplace: PixelPlace) {}

  public async drawRect(position: IVector2D, size: IVector2D, color: number): Promise<void> {
    return drawRectLinear(position, size, color, this.pixelplace.bots);
  }

  public async drawImage(position: IVector2D, imagePath: string, size: number, protect: boolean = false): Promise<IImageData> {
    return drawLinearImage(position, imagePath, size, protect, this.pixelplace);
  }
}

export default Render;
