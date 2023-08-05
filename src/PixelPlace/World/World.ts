import Auth from "../Bot/Auth/Auth";
import Connection from "../Bot/Connection/Connection";
import unpackPixel from "./Utils/unPackPixel";
import packPixel from "./Utils/packPixel";
import writeImageData from "../Helpers/Render/writeImageData";
import { onNetworkMessage } from "./Callbacks/onNetworkMessage";
import fetchCanvasPNG from "./Utils/fetchCanvasPNG";
import fs from "fs";
import IRegisterableCallbacks from "./Types/IRegisterableCallbacks";
import EPackets from "../Enums/EPackets";

class World {
  private connection: Connection;
  private canvasWidth: number = 3000;
  private canvasHeight: number = 3000;
  private canvas: Buffer;
  public registeredCallbacks: Map<EPackets, Function> = new Map<EPackets, Function>();

  constructor(private boardId: number) {
    this.connection = new Connection(new Auth("", ""), boardId, true);
    this.canvas = Buffer.alloc(this.canvasWidth * this.canvasHeight * 4).fill(-1);
  }

  public on(identifier: EPackets, callback: Function) {
    this.registeredCallbacks.set(identifier, callback);
  }

  public async Init() {
    await this.connection.Init();
    this.connection.registerOnMessage(onNetworkMessage, this);

    let canvasPng = await fetchCanvasPNG(this.boardId);

    let startTime = performance.now();
    await writeImageData(canvasPng, this);
    let endTime = performance.now();

    let diff = endTime - startTime;
    console.log(diff / 1000);

    fs.writeFileSync("dump.dump", this.canvas);
  }

  public syncPixels(pixels: number[][]) {
    for (let pixel of pixels) {
      this.writePixel(pixel[0], pixel[1], pixel[2]);
    }
  }

  public writePixel(x: number, y: number, color: number) {
    packPixel(this.canvas, (y * this.canvasWidth + x) * 4, x, y, color);
  }

  public getPixel(x: number, y: number) {
    return unpackPixel(this.canvas, (y * this.canvasWidth + x) * 4);
  }
}

export default World;
