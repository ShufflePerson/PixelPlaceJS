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
        cache.push(auth.getSessionData());
    }

    fs.writeFileSync("./cache.json", JSON.stringify(cache));
}

let protectId: number = 0;
let [x, y] = [1286, 1823];
let accounts = loadAuths();
let world = new World(7, accounts[0]);
let pixelplace = new PixelPlace(accounts, world, 7);


async function draw() {
    pixelplace.removeProtection(protectId)
    protectId = await pixelplace.render.drawImage({x, y}, "test.png", 0, true);
    setTimeout(draw, 5 * 60000);
}

async function main() {
    await world.Init();
    await pixelplace.Init();
    saveNewTokens(accounts);
    protectId = await pixelplace.render.drawImage({x, y}, "test.png", 0, true);
    draw();
}

main();