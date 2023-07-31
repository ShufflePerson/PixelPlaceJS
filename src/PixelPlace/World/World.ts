import Auth from "../Bot/Auth/Auth";
import Connection from "../Bot/Connection/Connection";
import EPackets from "../Bot/Connection/Enums/EPackets";
import parseIncomingMessage from "../Bot/Connection/Utils/parseIncomingMessage";
import winston from 'winston'
import IChatMessage from "../Types/User/IChatMessage";


class World {
    
    private connection: Connection;

    constructor(boardId: number) {
        this.connection = new Connection(new Auth("", ""), boardId, true);
    }
    
    public async Init() {
        await this.connection.Init();
        this.connection.registerOnMessage(this.onNetworkMessage)
    }

    private onNetworkMessage(rawMessage: string) {
        rawMessage = rawMessage.toString();
        let parsed = parseIncomingMessage(rawMessage);

        if (!parsed.data && !parsed.identifier) return;
        
        switch (parsed.identifier) {
            case EPackets.PIXEL:
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
                winston.log("info", "Canvas sync received", "World", parsed.data)
                break;
            default:
                console.log(parsed)
                winston.log("warn", "Packet type is not supported.", "World", parsed.identifier)
                break;
        }

    }
}

export default World;