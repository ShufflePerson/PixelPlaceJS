import axios from "axios";
import fs from 'fs';


async function fetchCanvasPNG(boardId: number): Promise<Buffer> {
    let currentTime: number = (new Date).getTime();
    let url: string = `https://pixelplace.io/canvas/${boardId}.png?t200000=${currentTime.toString()}`
    const buffer = (await axios({ url: url, responseType: "arraybuffer" })).data as Buffer;

    fs.writeFileSync("./temp/map.png", buffer)
    
    return buffer;
}

export default fetchCanvasPNG;