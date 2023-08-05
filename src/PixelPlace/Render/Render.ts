import Bot from "../Bot/Bot";
import drawRectLinear from "./Logic/Rect/drawLinearRect";
import IVector2D from "./Types/IVector2D";

class Render {
  constructor(private bots: Bot[]) {}

  public async drawRect(position: IVector2D, size: IVector2D, color: number): Promise<void> {
    return drawRectLinear(position, size, color, this.bots);
  }
}

export default Render;
