import Bot from "../Bot/Bot";
import { drawLinearImage } from "./Logic/Image/drawLinearImage";
import drawRectLinear from "./Logic/Rect/drawLinearRect";
import IVector2D from "./Types/IVector2D";

class Render {
  constructor(private bots: Bot[]) {}

  public async drawRect(position: IVector2D, size: IVector2D, color: number): Promise<void> {
    return drawRectLinear(position, size, color, this.bots);
  }

  public async drawImage(position: IVector2D, imagePath: string, size: number): Promise<void> {
    return drawLinearImage(position, imagePath, size, this.bots);
  }
}

export default Render;
