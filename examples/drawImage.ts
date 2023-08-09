import { PixelPlace, World, Auth, EDrawingMode } from '../src/index'
import fs from 'fs';

function loadCache() {
    if (!fs.existsSync("./cache.json"))
    throw new Error("No cache.json found. Please create one");

    return JSON.parse(fs.readFileSync("./cache.json").toString("utf-8"))
}

function loadAuths(): Auth[] {
    let cache = loadCache();
    let auths: Auth[] = [];
    
    for (let data of cache) {
        let { authId, authToken, authKey } = data;
        if (authId && authToken && authKey) {
            auths.push(new Auth(null, data));
        } else {
            console.warn(data, "Is invalid session data.");
        }
    }

    return auths;
}

function saveNewTokens(auths: Auth[]) {
    let cache: Array<any> = [];
    for (let auth of auths) {
        if (auth.didTokensRotate) {
            cache.push(auth.getSessionData());
        }
    }

    fs.writeFileSync("./cache.json", JSON.stringify(cache));
}

async function main() {

    let accounts = loadAuths();

    let world = new World(7, accounts[0]);
    let pixelplace = new PixelPlace(accounts, world, 7);

    await world.Init();
    await pixelplace.Init();

    saveNewTokens(accounts);

    let [x, y] = [1286, 1823];
    
    await pixelplace.render.drawImage({x, y}, "test.png", 0, true);
    //await pixelplace.render.drawRect({x, y}, {x: 100, y: 100}, Math.round(Math.random() * 32), false);
}

main();