enum EPackets {
    INIT = "init",
    PIXEL = "p",
    JOIN = "j",
    LEAVE = "l",
    PALIVE = "ping.alive",
    POALIVE = "pong.alive",
    NEW_CHAT_MESSAGE = "chat.user.message",
    DELETE_CHAT_MESSAGE = "chat.system.delete",
    CHAT_LOADED = "chat.messages.loaded",
    CANVAS = "canvas",
    CHAT_STATS = "chat.stats",
    RATE_CHANGE = "rate_change",
    FIGHT_START = "area_fight_start",
    FIGHT_END = "area_fight_end",
    ERROR = "throw.error",
    ITEM_USED = "item.notification.use",
    PREMIUM_MOD = "premium.mod",
    SAVE_TRACKING_CACHE = "save.tracking.cache", //Number
    SAVE_TRACKING_PENDING = "save.tracking.pending", //String ("error") || {pixels: ..., names: ...}
    QUEUE = "queue", //{time: seconds, position: int}
    SPECIAL_ERROR = "throw.error.special", // {id: number, message: string} 43 = logout, 42 = loadUserItems
    PROTECTION = "protection",
    COOLDOWN = "cooldown", //Number
    COOLDOWN_DOT = "cooldown_dot", //Number
    RELOAD = "reload",
    CANVAS_ACCESS_REQUESTED = "canvas.access.requested", //Number,
    USER_PROFILE = "user.profile", //{x, y, ...user}
    PAINTING_PLAYERS = "painting.players", // [{username, color}]
    HOT_PAINTINGS = "hot.paintings", // [{defaultColor, xMax, access, id}]
    COINS_GIFT_NOTIFICATION = "coins.notification.gift", //{from, to, amount}
    GOLDEN_NOTIFICATION = "golden.notification", //{way: number, username}
    ITEM_NOTIFICATION_SNOWBALL = "item.notification.snowball", //{from, to, snowballed: int}
    ITEM_NOTIFICATION_GIFT = "item.notification.gift", //{from, to, item: string}
    CHAT_SYSTEM_MESSAGE = "chat.system.message", // Number (EWSError)
    CANVAS_SUCCESS = "canvas.success", //String
    CANVAS_ALERT = "canvas.alert", //String
    CHAT_CUSTOM_MESSAGE = "chat.custom.message", //String
    CHAT_CUSTOM_ANNOUNCE = "chat.custom.announce", //String
    CHAT_PAINTING_DELETE = "chat.painting.delete", //String (username)
    CHAT_SYSTEM_DELETE = "chat.system.delete", //String (username)
    CHAT_MESSAGES_LOADED = "chat.messages.loaded", 
    CHAT_COMMAND = "chat.command", // {cmd: string, type: chatId}

    AREAS = "areas", //needed to reverse



}

export default EPackets;