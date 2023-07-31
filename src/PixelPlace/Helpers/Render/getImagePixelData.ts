import sharp from 'sharp'
import World from '../../World/World';
import getPxPColor from './getPxPColor';

export async function writeImageData(imageBuffer: Buffer, buffer: Buffer, world: World): Promise<void> {
    const imageInfo = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });

    const channels = imageInfo.info.channels;
    let pixelIndex = 0;

    for (let y = 0; y < imageInfo.info.height; y++) {
        for (let x = 0; x < imageInfo.info.width; x++) {
            const pixel: number[] = [];
            for (let channel = 0; channel < channels; channel++) {
                pixel.push(imageInfo.data[pixelIndex + channel]);
            }
            
            if (pixel[3] < 0.6) continue;

            world.writePixel(x, y, getPxPColor(pixel[0], pixel[1], pixel[2]));
            

            pixelIndex += channels;
        }
    }

}


export default writeImageData;