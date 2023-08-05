import Bot from "../../../Bot/Bot";
import IVector2D from "../../Types/IVector2D";

async function drawRectLinear(position: IVector2D, size: IVector2D, color: number, bots: Bot[]): Promise<void> {
    let startX = position.x;
    let startY = position.y;
    let endX = startX + size.x;
    let endY = startY + size.y;

    let x = startX;
    let y = startY;

    while (y < endY) {
        for (let bot of bots) {
            let placed = bot.placePixel(x, y, color);
            if (placed) {
                if (x < endX) 
                    x++;
                if (x >= endX) {
                    y++;
                    x = startX;
                }

                if (y < endY) {
                    break;
                }
            }
        }

        await new Promise((resolve) => setImmediate(resolve));
    }
}


export default drawRectLinear;