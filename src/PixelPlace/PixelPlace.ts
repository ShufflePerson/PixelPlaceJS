import Auth from "./Bot/Auth/Auth";
import Bot from "./Bot/Bot";
import winston from 'winston'


class PixelPlace  {
    private bots: Bot[] = [];
    
    constructor(private accounts: string[], private boardId: number) {
        for (let account of accounts) {
            let username = account.split(':')[0]
            let password = account.split(':')[1] || username;

            this.bots.push(new Bot(new Auth(
                username,
                password,
            ), boardId));
        }
    }

    public async Init() {
        for (let bot of this.bots) {
            let succesful = await bot.Init();
            if (!succesful) {
                winston.log("info", `Removing Bot`, "PixelPlace", bot.getEmail())
                this.bots.splice(this.bots.indexOf(bot), 1);
            }
        }

        winston.log("info", "Bots are ready.", "PixelPlace", this.bots.length)
    }
}

export default PixelPlace;