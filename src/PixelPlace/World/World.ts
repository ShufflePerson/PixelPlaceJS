import Auth from "../Bot/Auth/Auth";
import Connection from "../Bot/Connection/Connection";
import EPackets from "../Bot/Connection/Enums/EPackets";
import parseIncomingMessage from "../Bot/Connection/Utils/parseIncomingMessage";
import winston from 'winston'
import IChatMessage from "../Types/User/IChatMessage";
import unpackPixel from "./Utils/unPackPixel";
import packPixel from "./Utils/packPixel";
import fs from 'fs';
import axios from 'axios'
import writeImageData from "../Helpers/Render/getImagePixelData";

class World {
    
    private connection: Connection;
    private canvasWidth: number = 3000;
    private canvasHeight: number = 3000;
    private canvas: Buffer;

    constructor(private boardId: number) {
        this.connection = new Connection(new Auth("", ""), boardId, true);
        this.canvas = Buffer.alloc((this.canvasWidth * this.canvasHeight) * 4);
        
    }
    
    public async Init() {
        await this.connection.Init();
        this.connection.registerOnMessage(this.onNetworkMessage, this)
        
        let canvasPng = await this.fetchCanvasPNG();
        console.time("Canvas Convert")

        setTimeout(() => {
            writeImageData(canvasPng, this.canvas, this).then((data) => {
                console.timeEnd("Canvas Convert")
            });
        }, 1);
    }
    
    private async fetchCanvasPNG(): Promise<Buffer> {
        let currentTime: number = (new Date).getTime();
        let url: string = `https://pixelplace.io/canvas/${this.boardId}.png?t200000=${currentTime.toString()}`
        const buffer = (await axios({ url: url, responseType: "arraybuffer" })).data as Buffer;
        
        return buffer;
    }

    private onNetworkMessage(that: World, rawMessage: string) {
        rawMessage = rawMessage.toString();
        let parsed = parseIncomingMessage(rawMessage);

        if (!parsed.data && !parsed.identifier) return;
        
        switch (parsed.identifier) {
            case EPackets.PIXEL:
                that.syncPixels(parsed.data)
                break;
            case EPackets.JOIN:
                winston.log("info", "Player Joined", "World", parsed.data);
                break;
            case EPackets.LEAVE: 
                winston.log("info", "Player Left", "World", parsed.data)
                break;
            case EPackets.NEW_CHAT_MESSAGE:
                let chatMessage: IChatMessage = parsed.data;
                winston.log("info", "Chat Message", "World", chatMessage.username)
                break;
            case EPackets.CANVAS:
                that.syncPixels(parsed.data)
                winston.log("info", "Canvas paritial sync received", "World", parsed.data)
                break;
            default:
                console.log(parsed)
                winston.log("warn", "Packet type is not supported.", "World", parsed.identifier)
                break;
        }
    }
    
    private syncPixels(pixels: number[][]) {
        for (let pixel of pixels) {
            this.writePixel(pixel[0], pixel[1], pixel[2])
        }
        winston.log("debug", "Synced", "World", pixels.length);
    }
    
    public writePixel(x: number, y: number, color: number) {
        packPixel(this.canvas, (y * this.canvasWidth + x) * 4, x, y, color);
    }

    public getPixel(x: number, y: number) {
        return unpackPixel(this.canvas, (y * this.canvasWidth + x) * 4)
    }
}

export default World;