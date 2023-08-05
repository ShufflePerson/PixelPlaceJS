import getWorldLogger from "../../../Logging/World/getWorldLogger";
import parseIncomingMessage from "../../Bot/Connection/Utils/parseIncomingMessage";
import EPackets from "../../Enums/EPackets";
import EChatStats from "../../Enums/EChatStats";
import World from "../World";
import { onMessage } from "./Packets/onMessage";
import IChatStats from "../../Types/Chat/IChatStats";
import IFightEnd from "../../Types/Misc/Fight/IFightEnd";
import IFight from "../../Types/Misc/Fight/IFight";
import IUsedItem from "../../Types/Misc/IUsedItem";

let winston = getWorldLogger();

function onNetworkMessage(world: World, rawMessage: string) {
    rawMessage = rawMessage.toString();
    let parsed = parseIncomingMessage(rawMessage);
    if (!parsed.data && !parsed.identifier) return;

    let callbackFunction = world.registeredCallbacks.get(parsed.identifier as EPackets);
    let formattedData: any = parsed.data;

    switch (parsed.identifier) {
        case EPackets.PIXEL: //number[][]
            world.syncPixels(parsed.data)
            break;
        case EPackets.JOIN: // String
            winston.log("info", "Player Joined", "World", parsed.data);
            break;
        case EPackets.LEAVE: // String
            winston.log("info", "Player Left", "World", parsed.data)
            break;
        case EPackets.NEW_CHAT_MESSAGE: //IChatMessage
            onMessage(parsed.data);
            break;
        case EPackets.CANVAS: //number[][]
            world.syncPixels(parsed.data)
            winston.log("info", "Canvas paritial sync received", "World", parsed.data)
            break;
        case EPackets.CHAT_STATS: //number[] -> IChatStats
            let playersConnected = parsed.data[EChatStats.PLAYERS_CONNECTED];
            let playersOnline = parsed.data[EChatStats.PLAYERS_ONLINE];

            let chatStats: IChatStats = {
                playersConnected,
                playersOnline
            }

            formattedData = chatStats;

            winston.log("debug", "Received Chat statistic update.", playersConnected, playersOnline);
            break;
        case EPackets.FIGHT_START:  ///IFight
            let fightData: IFight = parsed.data;
            winston.log("debug", "Fight has started.", "World", fightData.id);
            break;
        case EPackets.FIGHT_END: //IFightEnd
            let fightEndData: IFightEnd = parsed.data;
            winston.log("debug", "Fight has ended.", "World", fightEndData.id);
            break;
        case EPackets.DELETE_CHAT_MESSAGE: //String
            let username: string = parsed.data;
            winston.log("debug", "Chat messages deleted.", "World", username);
            break;
        case EPackets.ITEM_USED: //IUsedItem
            let usedItem: IUsedItem = parsed.data;
            winston.log("debug", "Item has been used.", "World", usedItem.itemName, usedItem.from);
            break;
        default:
            console.log(parsed)
            winston.log("error", "Packet type is not supported.", "World", parsed.identifier)
            break;
    }
    
    if (typeof(callbackFunction) == "function") {
        callbackFunction(formattedData);
    }
}

export { onNetworkMessage }