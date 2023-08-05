import sharp from 'sharp'
import World from '../../World/World';
import getPxPColor from './getPxPColor';


export async function writeImageData(imageBuffer: Buffer, world: World): Promise<void> {
    const imageInfo = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });

    const { data, info } = imageInfo;
    const { channels, width, height } = info;
    const pixelCount = width * height * channels;

    for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += channels) {
        const alpha = data[pixelIndex + 3];
        
        if (alpha > 0.6) {
            const x = (pixelIndex / channels) % width;
            const y = Math.floor((pixelIndex / channels) / width);

            const pixelB = world.getPixel(x, y);
            if (pixelB[0] !== -1) {
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                world.writePixel(x, y, getPxPColor(r, g, b));
            }
        }
    }
}
export default writeImageData;