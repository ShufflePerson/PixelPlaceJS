import EError from "./Auth/EError";
import IError from "./Auth/IError";
import ICanvasAccessRequested from "./Canvas/ICanvasAccessRequested";
import ICanvasAlert from "./Canvas/ICanvasAlert";
import ICanvasSuccess from "./Canvas/ICanvasSuccess";
import IHotPaintings from "./Canvas/IHotPaintings";
import IPaintingPlayers from "./Canvas/IPaintingPlayers";
import IChatPaintingDelete from "./Chat/Delete/IChatPaintingDelete";
import IChatSytemDelete from "./Chat/Delete/IChatSytemDelete";
import IChatCommand from "./Chat/IChatCommand";
import IChatCustomAnnounce from "./Chat/IChatCustomAnnounce";
import IChatCustomMessage from "./Chat/IChatCustomMessage";
import IChatMessage from "./Chat/IChatMessage";
import IChatStats from "./Chat/IChatStats";
import IChatSystemMessage from "./Chat/IChatSystemMessage";
import ISaveTrackingCache from "./Misc/Cache/ISaveTrackingCache";
import ICooldown from "./Misc/Cooldown/ICooldown";
import ICooldownDot from "./Misc/Cooldown/ICooldownDot";
import IFight from "./Misc/Fight/IFight";
import IFightEnd from "./Misc/Fight/IFightEnd";
import IQueue from "./Misc/IQueue";
import IUsedItem from "./Misc/IUsedItem";
import ICoinsGiftNotification from "./Notification/ICoinsGiftNotification";
import IGoldenNotification from "./Notification/IGoldenNotification";
import INotificationGift from "./Notification/INotificationGift";
import INotificationSnowball from "./Notification/INotificationSnowball";
import ISpecialError from "./User/Error/ISpecialError";
import IUser from "./User/IUser";
import IUserProfile from "./User/IUserProfile";

namespace Types {
  export namespace Auth {
    export type Error = IError;
  }

  export namespace Canvas {
    export type CanvasAccessRequested = ICanvasAccessRequested;
    export type CanvasAlert = ICanvasAlert;
    export type CanvasSuccess = ICanvasSuccess;
    export type HotPaintings = IHotPaintings;
    export type PaintingPlayers = IPaintingPlayers;
  }

  export namespace Chat {
    export namespace Delete {
      export type ChatPaintingDelete = IChatPaintingDelete;
      export type ChatSytemDelete = IChatSytemDelete;
    }
    export type ChatCommand = IChatCommand;
    export type ChatCustomAnnounce = IChatCustomAnnounce;
    export type ChatCustomMessage = IChatCustomMessage;
    export type ChatMessage = IChatMessage;
    export type ChatStats = IChatStats;
    export type ChatSystemMessage = IChatSystemMessage;
  }

  export namespace Misc {
    export namespace Cache {
      export type SaveTrackingCache = ISaveTrackingCache;
      export type SaveTrackingPending = ISaveTrackingPending;
    }
    export namespace Cooldown {
      export type Cooldown = ICooldown;
      export type CooldownDot = ICooldownDot;
    }
    export namespace Fight {
      export type Fight = IFight;
      export type FightEnd = IFightEnd;
    }
    export type Queue = IQueue;
    export type UsedItem = IUsedItem;
  }

  export namespace Notification {
    export type CoinsGiftNotification = ICoinsGiftNotification;
    export type GoldenNotification = IGoldenNotification;
    export type NotificationGift = INotificationGift;
    export type NotificationSnowball = INotificationSnowball;
  }

  export namespace User {
    export namespace Error {
      export type SpecialError = ISpecialError;
    }
    export type User = IUser;
    export type UserProfile = IUserProfile;
  }
}

export default Types;
