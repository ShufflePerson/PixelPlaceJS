import { World } from '../src/'

(async () => {
    let world = new World(7);
    await world.Init();

    let [x, y, color] = world.getPixel(954, 321);
    
    console.log(x, y, color)
})()