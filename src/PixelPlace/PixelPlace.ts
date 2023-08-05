import Auth from "./Bot/Auth/Auth";
import Bot from "./Bot/Bot";
import winston from 'winston'
import Render from "./Render/Render";
import World from "./World/World";


class PixelPlace  {
    private bots: Bot[] = [];
    public render: Render;
    
    constructor(private accounts: string[], private world: World, private boardId: number) {
        for (let account of accounts) {
            let username = account.split(':')[0]
            let password = account.split(':')[1] || username;

            this.bots.push(new Bot(new Auth(
                username,
                password,
            ), world, boardId));
        }

        setInterval((() => {
            for (let bot of this.bots) {
                if (!bot.connection.isWorking) {
                    winston.log("info", `Removing Bot`, "PixelPlace", bot.getEmail())
                    this.bots.splice(this.bots.indexOf(bot), 1);
                }
            }
        }), 100)

        this.render = new Render([]);
    }

    public async Init() {
        for (let bot of this.bots) {
            let succesful = await bot.Init();
            if (!succesful) {
                winston.log("info", `Removing Bot`, "PixelPlace", bot.getEmail())
                this.bots.splice(this.bots.indexOf(bot), 1);
            }
        }
        
        if(this.bots.length == 0) {
            throw new Error("No valid accounts.")
        }


        this.render = new Render(this.bots);
        winston.log("info", "Bots are ready.", "PixelPlace", this.bots.length)
    }
}

export default PixelPlace;