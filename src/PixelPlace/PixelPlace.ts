import Auth from "./Bot/Auth/Auth";
import Bot from "./Bot/Bot";
import winston from "winston";
import Render from "./Render/Render";
import World from "./World/World";
import IImageData from "./Render/Types/IImageData";
import EPackets from "./Enums/EPackets";
import isInsidePoint from "./Helpers/Math/isInsidePoint";
import unpackPixel from "./World/Utils/unPackPixel";

class PixelPlace {
  public bots: Bot[] = [];
  public render: Render;

  constructor(
    private auths: Auth[],
    private world: World,
    private boardId: number
  ) {
    for (let auth of auths) {
      this.bots.push(new Bot(auth, world, boardId));
    }

    setInterval(() => {
      for (let bot of this.bots) {
        if (!bot.connection.isWorking) {
          winston.log("info", `Removing Bot`, "PixelPlace", bot.getEmail());
          this.bots.splice(this.bots.indexOf(bot), 1);
        }
      }
    }, 100);

    this.render = new Render(this);
  }

  public RegisterProtectionZone(startX: number, startY: number, original: IImageData) {
    const { width, height } = original.metadata;
    
    this.world.on(EPackets.PIXEL, (pixels: number[][]) => {
      for (let pixel of pixels) {
        let [x, y, color] = pixel;
        if (isInsidePoint({ x: startX, y: startY }, { x: width, y: height }, { x, y })) {
          let originalPixel = unpackPixel(original.buffer, ((y - startY) * width + (x - startX)) * 4);
          this.placePixel(x, y, originalPixel[2], true);
        }
      }
    });
  }
  

  public async placePixel(x: number, y: number, color: number, force: boolean = false): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      let interv = setInterval(() => {
        for (let bot of this.bots) {
          if(bot.placePixel(x, y, color, force)) {
            resolve(true);
            clearInterval(interv);
            break;
            return;
          }
        }
      }, 5)
    })

  }

  public async Init() {
    for (let bot of this.bots) {
      let succesful = await bot.Init();
      if (!succesful) {
        winston.log("info", `Removing Bot`, "PixelPlace", bot.getEmail());
        this.bots.splice(this.bots.indexOf(bot), 1);
      }
    }

    if (this.bots.length == 0) {
      throw new Error("No valid accounts.");
    }

    this.render = new Render(this);
    winston.log("info", "Bots are ready.", "PixelPlace", this.bots.length);
  }
}

export default PixelPlace;
