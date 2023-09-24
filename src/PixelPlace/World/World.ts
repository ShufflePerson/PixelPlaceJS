import Auth from "../Bot/Auth/Auth";
import Connection from "../Bot/Connection/Connection";
import unpackPixel from "./Utils/unpackPixel";
import packPixel from "./Utils/packPixel";
import writeImageData from "../Helpers/Render/writeImageData";
import { onNetworkMessage } from "./Callbacks/onNetworkMessage";
import fetchCanvasPNG from "./Utils/fetchCanvasPNG";
import EPackets from "../Enums/EPackets";

class World {
  private connection: Connection;
  private canvasWidth: number = 3000;
  private canvasHeight: number = 3000;
  private canvas: Buffer;
  public registeredCallbacks: Map<EPackets, Array<Function>> = new Map<EPackets, Array<Function>>();
  private lastTick = Number.MAX_SAFE_INTEGER;

  constructor(
    private boardId: number,
    private auth: Auth = new Auth(null, null)
  ) {
    this.connection = new Connection(this.auth, boardId);
    this.canvas = Buffer.alloc(this.canvasWidth * this.canvasHeight * 4);
  }

  public on(identifier: EPackets, callback: Function) {
    let currentCallbacks = this.registeredCallbacks.get(identifier);
    if (!currentCallbacks) currentCallbacks = [];
    this.registeredCallbacks.set(identifier, [...currentCallbacks, callback]);
  }

  public async Init() {
    await this.auth.Login();
    await this.connection.Init();
    this.connection.registerOnMessage(onNetworkMessage, this);

    let canvasPng = await fetchCanvasPNG(this.boardId);

    await writeImageData(canvasPng, this);
  }

  public syncPixels(pixels: number[][]) {
    this.lastTick = Date.now();
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
