import Auth from "../Auth/Auth";
import WebSocket from "ws";
import winston from "winston";
import EPackets from "../../Enums/EPackets";
import sleep from "../../../Utils/sleep";
import getEmitMessage from "./Utils/getEmitMessage";
import parseIncomingMessage from "./Utils/parseIncomingMessage";
import World from "../../World/World";
import { getPalive } from "../../Helpers/getPAlive";
import EWSErrorDescription from "../../Enums/Error/EWSErrorDescrption";
import getTDelay from "../../Helpers/getTDelay";

class Connection {
  private ws: WebSocket | null = null;
  public isWorking: boolean = true;
  private onMessageCallback: Function | null = null;
  private world: World | null = null;
  private tDelay: number = 0;

  constructor(
    private auth: Auth,
    private boardId: number,
    private isGuest: boolean = false
  ) {}

  public async Init(): Promise<boolean> {
    try {
      winston.log("info", "Starting WebSocket Connection", "Connection");
      this.ws = new WebSocket("wss://pixelplace.io/socket.io/?EIO=4&transport=websocket", {
        headers: {
          ...this.auth.getHeaders(),
          "Sec-Websocket-Extensions": "permessage-deflate; client_max_window_bits"
        }
      });

      winston.log("info", "Registering callbacks", "Connection");
      this.ws.on("message", (msg: string) => {
        this.onNetworkMessage(msg);
      });
      let isReady = false;
      this.ws.on("error", this.onError);

      this.ws.on("open", async () => {
        winston.log("info", "WebSocket Connection opened.", "Connection");
        
        this.ws?.send("40");
        this.ws?.send("3");
        
        await sleep(1000);

        if (this.auth.getSessionData() != null)
          this.emit(EPackets.INIT, {
            ...this.auth.getSessionData(),
            boardId: this.boardId
          });
        else this.emit(EPackets.INIT, { authId: "", boardId: this.boardId });
        

        setTimeout(() => {
          isReady = true;
        }, 3500);

        setInterval(() => {
          this.ws?.send("3");
        }, 4500);
      });

      this.ws.on("close", async () => {
        winston.log("error", "WebSocket connection closed. Trying to reconnect", "Connection");
        await this.Init();
        if (this.onMessageCallback && this.world)
          this.registerOnMessage(this.onMessageCallback, this.world);
      });

      while (!isReady) {
        await sleep(20);
        await new Promise((resolve) => setImmediate(resolve));
      }

      return true;
    } catch (ex) {
      return false;
    }
  }

  private async onNetworkMessage(rawMessage: string) {
    rawMessage = rawMessage.toString();
    let parsed = parseIncomingMessage(rawMessage);
    
    if (!parsed.data && !parsed.identifier) return;

    if (parsed.identifier == EPackets.PALIVE) {
      this.emit(EPackets.POALIVE, getPalive(this.tDelay));
    }

    if (parsed.identifier == EPackets.SERVER_TIME) {
      let serverTime: number = parseInt(parsed.data);
      let tDelay = getTDelay(serverTime);
      this.tDelay = tDelay;
    }

    if (parsed.identifier == EPackets.ERROR) {
      let errorId = parsed.data;

      switch (errorId) {
        case 2:
          winston.log("info", "Username has not been set.", "Connection", this.auth.getEmail());
          await this.auth.setUsername();
          break;

        default:
          winston.log("error", "Error occured, most likely invalid token data.", "Connection", errorId, EWSErrorDescription[errorId], this.auth.getEmail());
          this.isWorking = false;
          break;
      }
    }

    let supported = Object.keys(EPackets);
    for (let support of supported) {
      if ((EPackets as any)[support] == parsed.identifier) return;
    }
  }

  public registerOnMessage(func: any, world: World) {
    this.ws?.on("message", (message: string) => {
      this.onMessageCallback = func;
      this.world = world;
      func(world, message);
    });
  }

  public emit(identifier: EPackets, data: any) {
    this.ws?.send(getEmitMessage(identifier, data));
  }

  private onError(error: WebSocket.ErrorEvent) {
    console.log("WS ERROR!");
    console.log(error);
  }

  public sendPlacePixel(x: number, y: number, color: number) {
    this.emit(EPackets.PIXEL, [x, y, color, 1]);
  }
}

export default Connection;
