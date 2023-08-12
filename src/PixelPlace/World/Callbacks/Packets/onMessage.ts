import getWorldLogger from "../../../../Logging/World/getWorldLogger";
import IChatMessage from "../../../Types/Chat/IChatMessage";

let winston = getWorldLogger();

function onMessage(chatMessage: IChatMessage) {
  winston.log("info", "Chat Message", "World", chatMessage.username, chatMessage.message);
  if (chatMessage.admin || chatMessage.chatmod || chatMessage.mod) {
    winston.log("info", "Mod has sent a chat message.", "onMessage", chatMessage.username);
  }
}

export { onMessage };
