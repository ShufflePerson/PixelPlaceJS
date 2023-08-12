import sleep from "../../Utils/sleep";
import Bot from "../Bot/Bot";
import eventLoopQueue from "../Helpers/eventLoopQueue";
import IVector2D from "../Render/Types/IVector2D";
import unpackPixel from "../World/Utils/unPackPixel";
import EPixelJobPriority from "./Enums/EPixelJobPriority";
import placePixel from "./Utils/placePixel";

class PixelJob {
  private progress: number = 0;
  private isPaused: boolean = false;

  constructor(
    private buffer: Buffer,
    private position: IVector2D,
    private size: IVector2D,
    private priority: EPixelJobPriority,
    private bots: Bot[]
  ) {}

  public startJob(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      resolve();
      for (let y = 0; y < this.size.y; y++) {
        for (let x = 0; x < this.size.x; x++) {
          if (this.isPaused) {
            x = x - 1;
            continue;
          }

          let [X, Y, color] = unpackPixel(this.buffer, (y * this.size.x + x) * 4);
          let realX = this.position.x + X;
          let realY = this.position.y + Y;

          let wasSuccesful = await placePixel(realX, realY, color, this.bots);
          if (!wasSuccesful) x = x - 1;
          else {
            this.progress++;
          }
        }
      }
    });
  }

  public pauseJob() {
    this.isPaused = true;
  }

  public unPauseJob() {
    this.isPaused = false;
  }

  public async waitForFinish(): Promise<void> {
    if (this.progress == this.size.x * this.size.y) return;
    return new Promise((resolve, reject) => {
      let interv = setInterval(() => {
        if (this.progress == this.size.x * this.size.y) {
          clearInterval(interv);
          resolve();
        }
      }, 100);
    });
  }
}

export default PixelJob;
