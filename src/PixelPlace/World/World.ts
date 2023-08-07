import Auth from "../Bot/Auth/Auth";
import Connection from "../Bot/Connection/Connection";
import unpackPixel from "./Utils/unPackPixel";
import packPixel from "./Utils/packPixel";
import writeImageData from "../Helpers/Render/writeImageData";
import { onNetworkMessage } from "./Callbacks/onNetworkMessage";
import fetchCanvasPNG from "./Utils/fetchCanvasPNG";
import EPackets from "../Enums/EPackets";
import ISessionData from "../Types/PixelPlace/ISessionData";
import ILoginData from "../Bot/Auth/Types/ILoginData";

class World {
  private connection: Connection;
  private canvasWidth: number = 3000;
  private canvasHeight: number = 3000;
  private canvas: Buffer;
  public registeredCallbacks: Map<EPackets, Function> = new Map<EPackets, Function>();

  constructor(
    private boardId: number,
    private auth: Auth = new Auth(null, null)
  ) {
    this.connection = new Connection(this.auth, boardId);
    this.canvas = Buffer.alloc(this.canvasWidth * this.canvasHeight * 4);
  }

  public on(identifier: EPackets, callback: Function) {
    this.registeredCallbacks.set(identifier, callback);
  }

  public async Init() {
    await this.auth.Login();
    await this.connection.Init();
    this.connection.registerOnMessage(onNetworkMessage, this);

    let canvasPng = await fetchCanvasPNG(this.boardId);

    await writeImageData(canvasPng, this);
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
