import packPixel from "../../../World/Utils/packPixel";
import IVector2D from "../../Types/IVector2D";

function getRect(position: IVector2D, size: IVector2D, color: number): Buffer {
  let buffer = Buffer.alloc(size.x * size.y * 4);
  
  for (let y = 0; y < size.y; y++) {
    for (let x = 0; x < size.x; x++) {
      packPixel(buffer, (y * size.x +  x) * 4, x, y, color);
    }
  }


  return buffer;
}

export default getRect;
