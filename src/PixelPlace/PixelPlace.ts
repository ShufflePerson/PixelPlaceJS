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
import PixelJob from "./PixelJob/PixelJob";
import EPixelJobPriority from "./PixelJob/Enums/EPixelJobPriority";
import eventLoopQueue from "./Helpers/eventLoopQueue";
import placePixel from "./PixelJob/Utils/placePixel";

class PixelPlace {
  public bots: Bot[] = [];
  public render: Render;
  private toProtect: number[][] = [];
  private toPlace: number[][] = [];
  private protectedZones: Array<{
    position: IVector2D;
    imageData: IImageData;
  }> = [];
  private pixelJobs = new Map<number, PixelJob>();

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

  public createPixelJob(buffer: Buffer, position: IVector2D, size: IVector2D, priority: EPixelJobPriority = EPixelJobPriority.LOW): number {
    let id = Math.round(Math.random() * 99999);
    this.pixelJobs.set(id, new PixelJob(buffer, position, size, priority, this.bots));

    return id;
  }

  public startPixelJob(id: number) {
    this.pixelJobs.get(id)?.startJob();
  }

  public waitForPixelJobFinish(id: number) {
    return this.pixelJobs.get(id)?.waitForFinish();
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

    let inProgress = false;

    setInterval(async () => {
      if (inProgress) return;
      inProgress = true;
      for (let jobArr of this.pixelJobs) {
        let [id, job] = jobArr;
        await job.waitForFinish();
      }

      let originalLength = this.toProtect.length;
      let toPlace = [...new Set(this.toProtect.slice())];

      for (let i = 0; i < toPlace.length; i++) {
        let pixel = toPlace[i];
        if (!(await placePixel(pixel[0], pixel[1], pixel[2], this.bots, true))) {
          i = i - 1;
        }
      }

      this.toProtect.splice(originalLength - 1, 1);

      inProgress = false;
    }, 5);

    winston.log("info", "Bots are ready.", "PixelPlace", this.bots.length);
  }
}

export default PixelPlace;
