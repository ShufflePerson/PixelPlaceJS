import { PixelPlace, World, Types, EPackets, Auth } from '../src'



async function main() {

    let accounts: Auth[] = [
        new Auth(null, {
            authId: "",
            authKey: "",
            authToken: ""
        })
    ]

    let world = new World(7);
    let pixelplace = new PixelPlace(accounts, world, 7);

    await world.Init();
    await pixelplace.Init();

    pixelplace.render.drawRect({
        x: 1377,
        y: 1760
    }, {
        x: 100,
        y: 200
    }, 6)
}

main();