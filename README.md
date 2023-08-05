# Onehook
Fully documented and strongly typed nodejs libary for PixelPlace.io

## Usage

### Listen for events using the `world` module

```ts

import { World, EPackets, Types } from 'Onehook'

(async () => {

    const CANVAS_ID = 7;

    let world = new World(CANVAS_ID);
    await world.Init();

    world.on(EPackets.NEW_CHAT_MESSAGE, (message: Types.Chat.ChatMessage) => {
        console.log(`${message.username}: ${message.message}`)
    })

    console.log("PP is running")
})()

```

### Use one or more bots to draw

```ts

import { World, PixelPlace } from 'Onehook'

(async () => {

    const CANVAS_ID = 7;

    let world = new World(CANVAS_ID);
    await world.Init();
    console.log("World is ready!")

    let pp = new PixelPlace(["myEmail@gmail.com:MyPassword123@"], world, CANVAS_ID);
    await pp.Init();
    console.log("PP is ready!")


    pp.render.drawRect({
        x: 1234,
        y: 1234
    }, {
        x: 100,
        y: 100
    }, 3)


})()


```