interface IChatMessage {
    username: string;
    color: number;
    guild: string;
    message: string;
    admin: boolean;
    mod: boolean;
    chatmod: boolean;
    premium: boolean;
    icons: string[];
    rainbow: boolean;
    xmas: boolean;
    halloween: boolean;
    channel: string;
    golden: number;
    mention: string;
    target: string;
    type: 'chat';
    snowballed: number;
    createdAt: string;
    silent: boolean;
}

export default IChatMessage;