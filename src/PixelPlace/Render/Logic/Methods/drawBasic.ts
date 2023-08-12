import winston from "winston";
import EPixelJobPriority from "../../../PixelJob/Enums/EPixelJobPriority";
import PixelPlace from "../../../PixelPlace";
import packPixel from "../../../World/Utils/packPixel";
import unpackPixel from "../../../World/Utils/unPackPixel";
import IVector2D from "../../Types/IVector2D";

export default async (position: IVector2D, width: number, height: number, buffer: Buffer, forceOverride: boolean, pixelplace: PixelPlace): Promise<void> => {
  let jobId = pixelplace.createPixelJob(
    buffer,
    position,
    {
      x: width,
      y: height
    },
    EPixelJobPriority.MEDIUM
  );

  pixelplace.startPixelJob(jobId);
  winston.log("info", "New Pixel Job has been started.", "drawBasic", jobId);

  await pixelplace.waitForPixelJobFinish(jobId);
};
