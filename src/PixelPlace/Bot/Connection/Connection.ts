import ISessionData from "../../Types/PixelPlace/ISessionData";
import Auth from "../Auth/Auth";
import WebSocket from 'ws'
import winston from 'winston'
import EPackets from "./Enums/EPackets";
import sleep from "../../../Utils/sleep";
import getEmitMessage from "./Utils/getEmitMessage";
import parseIncomingMessage from "./Utils/parseIncomingMessage";

class Connection {
    
    private ws: WebSocket | null = null;

    constructor(private auth: Auth, private boardId: number, private isGuest: boolean = false) {
    }
    
    public async Init(): Promise<void> {


        winston.log("info", "Starting WebSocket Connection", "Connection");
        this.ws = new WebSocket("wss://pixelplace.io/socket.io/?EIO=3&transport=websocket", {
            headers: this.auth.getHeaders()
        })
        
        winston.log("info", "Registering callbacks", "Connection");
        this.ws.on("message", this.onMessage);
        this.ws.on("error", this.onError);
        this.ws.on("open", (() => {
            winston.log("info", "WebSocket Connection opened.", "Connection");
            
            this.emit(EPackets.INIT, {authId: "", boardId: this.boardId});

            setInterval(() => {
                this.ws?.send("2");
            }, 4500)
        }))
        
        this.ws.on("close", (() => {
            winston.log("error", "WebSocket connection closed", "Connection");
        }))
    }

    public registerOnMessage(func: any) {
        this.ws?.on("message", func);
    }
    
    private emit(identifier: EPackets, data: any) {
        this.ws?.send(getEmitMessage(identifier, data))
    }

    private onMessage(message: string) {
        //message = message.toString()
        //console.log(parseIncomingMessage(message))
    }

    private onError(error: WebSocket.ErrorEvent) {
        console.log(error);
    }
    
    public sendPlacePixel(x: number, y: number, color: number) {
        this.ws?.emit("p", [x, y, color])
    }

}

export default Connection;