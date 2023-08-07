import { World, PixelPlace, EPackets, Types, Auth } from '../src/'
import { WebSocketServer, WebSocket } from 'ws';


const wss = new WebSocketServer({ port: 8080 });


let clients: Map<string, WebSocket> = new Map<string, WebSocket>();

wss.on('connection', function connection(ws, req) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });

    let ip = req.socket.remoteAddress;

    if (!ip) {
        ws.close();
        return;
    }

    if (clients.get(ip) != undefined) {
        let oldWs = clients.get(ip);
        oldWs?.close();
        clients.delete(ip);
    }

    ws.on("close", (() => {
        if(ip) {
            clients.delete(ip);
        }
    }))
    
    clients.set(ip , ws);
    
});

function sendDataToClients(data: number[][]) {
    clients.forEach((ws, key) => {
        console.log(key)
        ws.send(JSON.stringify(data));
    })
}


(async () => {
    let currentData: number[][] = [];

    let account = new Auth(null, {
        authId: "", //Fill out these values
        authKey: "",
        authToken: ""
    })

    let world = new World(7, account);
    await world.Init();

    world.on(EPackets.PIXEL, (pixels: number[][]) => {
        for (let pixel of pixels) {
            if (!pixel[4]) {
                throw new Error("Account is not Premium!");
            }
            
            currentData.push(pixel);
        }
    });

    setInterval(() => {
        sendDataToClients(currentData);
        currentData = [];
    }, 1000)

    console.log("PP is running");
})();