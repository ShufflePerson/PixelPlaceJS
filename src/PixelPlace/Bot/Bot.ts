import Auth from "./Auth/Auth";
import winston from 'winston'
import Connection from "./Connection/Connection";
import World from "../World/World";


class Bot {

    public connection: Connection;
    private lastPixelPlace: number = 0;

    constructor(private auth: Auth, private world: World, boardId: number) {
        this.connection = new Connection(auth, boardId)
    }

    public async Init(): Promise<boolean> {
        let loginResponse = await this.auth.Login();

        if (!(loginResponse as any).authId) {
            winston.log("error", `Failed to login`, "Bot", loginResponse)
            return false;
        }
        
        let sucessful = await this.connection.Init();
        if (!sucessful) return false;
        
        return true;
    }

    public getEmail(): string {
        return this.auth.getEmail();
    }

    public placePixel(x: number, y: number, color: number): Boolean {
        let time = Date.now();
        let diff = time - this.lastPixelPlace;
        if (diff < 20) return false;
        
        if (this.world.getPixel(x, y)[2] == color) return true;
        
        this.lastPixelPlace = time;

        this.connection.sendPlacePixel(x, y, color);

        return true;
    }
}

export default Bot;