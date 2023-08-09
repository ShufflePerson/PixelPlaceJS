import Auth from "./Bot/Auth/Auth";
import Bot from "./Bot/Bot";
import winston from "winston";
import Render from "./Render/Render";
import World from "./World/World";
import IImageData from "./Render/Types/IImageData";
import EPackets from "./Enums/EPackets";
import isInsidePoint from "./Helpers/Math/isInsidePoint";
import unpackPixel from "./World/Utils/unPackPixel";
import IVector2D from "./Render/Types/IVector2D";
import sleep from "../Utils/sleep";

const eventLoopQueue = () => {
  return new Promise((resolve, reject) => 
    setImmediate(() => {
      resolve(null);
    })
  );
}

class PixelPlace {
  public bots: Bot[] = [];
  public render: Render;
  private toProtect: number[][] = [];
  private protectedZones: Array<{
    position: IVector2D;
    imageData: IImageData;
  }> = [];

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

  private getProtectId(startX: number, startY: number, original: IImageData): number {
    return Math.round((startX * startY) / original.metadata.height + original.metadata.width);
  }

  public registerProtectionZone(startX: number, startY: number, original: IImageData): number {
    this.protectedZones.push({
      position: {
        x: startX,
        y: startY
      },
      imageData: original
    });

    return this.getProtectId(startX, startY, original);
  }

  public removeProtection(id: number) {
    for (let i = 0; i < this.protectedZones.length; i++) {
      let zone = this.protectedZones[i];
      let zoneId = this.getProtectId(zone.position.x, zone.position.y, zone.imageData);
      if (id == zoneId) {
        this.protectedZones.splice(i, 1);
        break;
      }
    }
  }

  public async placePixel(x: number, y: number, color: number, force: boolean = false): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      let placed = false;
      while (!placed) {
        for (let bot of this.bots) {
          placed = bot.placePixel(x, y, color, force);
          if (placed) {
            resolve(true);
            break;
          }
        }
        await eventLoopQueue();
      }
    });
  }

  public async Init(): Promise<void> {
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

    this.world.on(EPackets.PIXEL, (pixels: number[][]) => {
      for (let protectedZone of this.protectedZones) {
        let startX = protectedZone.position.x;
        let startY = protectedZone.position.y;
        let { width, height } = protectedZone.imageData.metadata;

        for (let pixel of pixels) {
          let [x, y, color] = pixel;
          if (isInsidePoint({ x: startX, y: startY }, { x: width - 1, y: height - 1 }, { x, y })) {
            let originalPixel = unpackPixel(protectedZone.imageData.buffer, ((y - startY) * width + (x - startX)) * 4);
            if (color != originalPixel[2]) {
              this.toProtect.push([x, y, originalPixel[2]]);
            }
          }
        }
      }
    });

    setInterval(async () => {
      for (let i = 0; i < this.toProtect.length; i++) {
        let pixel = this.toProtect[i];
        let [x, y, color] = pixel;
        this.toProtect.splice(i, 1);
        this.placePixel(x, y, color, true);
      }
    }, 20);

    winston.log("info", "Bots are ready.", "PixelPlace", this.bots.length);
  }
}

export default PixelPlace;
