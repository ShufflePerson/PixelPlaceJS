import { PixelPlace, World, Types, EPackets } from '../src/index'



async function main() {
    let world = new World(7);
    let pixelplace = new PixelPlace(["email@gmail.com"], world, 7);

    await world.Init();
    await pixelplace.Init();

    pixelplace.render.drawImage({
        x: 1283,
        y: 1579
    },"test.png", 60);
}

main();