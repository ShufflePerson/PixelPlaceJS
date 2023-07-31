import Auth from "./Auth/Auth";
import winston from 'winston'
import Connection from "./Connection/Connection";


class Bot {

    private connection: Connection;

    constructor(private auth: Auth, boardId: number) {
        this.connection = new Connection(auth, boardId)
    }

    public async Init(): Promise<boolean> {
        let loginResponse = await this.auth.Login();

        if ((loginResponse as any).id != undefined) {
            winston.log("error", `Failed to login`, "Bot", loginResponse)
            return false;
        }
        
        await this.connection.Init();
        
        this.connection.sendPlacePixel(1459, 867, 4);


        return true;
    }

    public getEmail(): string {
        return this.auth.getEmail();
    }
}

export default Bot;