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

class Connection {
  private ws: WebSocket | null = null;
  public isWorking: boolean = true;

  constructor(
    private auth: Auth,
    private boardId: number,
    private isGuest: boolean = false
  ) {}

  public async Init(): Promise<boolean> {
    try {
      winston.log("info", "Starting WebSocket Connection", "Connection");
      this.ws = new WebSocket("wss://pixelplace.io/socket.io/?EIO=3&transport=websocket", {
        headers: this.auth.getHeaders()
      });

      winston.log("info", "Registering callbacks", "Connection");
      this.ws.on("message", (msg: string) => {
        this.onNetworkMessage(msg);
      });
      let isReady = false;
      this.ws.on("error", this.onError);
      this.ws.on("open", () => {
        winston.log("info", "WebSocket Connection opened.", "Connection");

        if (this.auth.getSessionData())
          this.emit(EPackets.INIT, {
            ...this.auth.getSessionData(),
            boardId: this.boardId
          });
        else this.emit(EPackets.INIT, { authId: "", boardId: this.boardId });

        setTimeout(() => {
          isReady = true;
        }, 500);

        setInterval(() => {
          this.ws?.send("2");
        }, 4500);
      });

      this.ws.on("close", () => {
        winston.log("error", "WebSocket connection closed", "Connection");
      });

      while (!isReady) {
        await sleep(20);
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
      this.emit(EPackets.POALIVE, getPalive());
    }

    if (parsed.identifier == EPackets.ERROR) {
      let errorId = parsed.data;

      switch (errorId) {
        case 2:
          winston.log("info", "Username has not been set.", "Connection", this.auth.getEmail());
          await this.auth.setUsername();
          break;

        default:
          winston.log("error", "Error occured, most likely invalid token data.", "Connection", EWSErrorDescription[errorId], this.auth.getEmail());
          this.isWorking = false;
          break;
      }
    }

    let supported = Object.keys(EPackets);
    for (let support of supported) {
      if ((EPackets as any)[support] == parsed.identifier) return;
    }
  }

  public registerOnMessage(func: any, that: World) {
    this.ws?.on("message", (message: string) => {
      func(that, message);
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
