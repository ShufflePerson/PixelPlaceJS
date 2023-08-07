import { PixelPlace, World, Auth } from '../src/index'



async function main() {

    let accounts: Auth[] = [
        new Auth(null, {
            authId: "", //Fill these values
            authKey: "",
            authToken: ""
        })
    ]

    let world = new World(7, accounts[0]);
    let pixelplace = new PixelPlace(accounts, world, 7);

    await world.Init();
    await pixelplace.Init();

    let [x, y] = [1336, 1839];

    let imageData = await pixelplace.render.drawImage({x, y}, "test.png", 200, true);
}

main();