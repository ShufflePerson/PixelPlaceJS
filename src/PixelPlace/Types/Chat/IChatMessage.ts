import IUser from "../User/IUser";

interface IChatMessage extends IUser {
  createdAt: string;
  silent: boolean;
  mention: string;
  target: string;
  type: "chat";
  message: string;
}

export default IChatMessage;
