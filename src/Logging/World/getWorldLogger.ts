import winston from "winston";
import fs from "fs";
import isDev from "../isDev";

let logger: winston.Logger | null = null;

export default (): winston.Logger => {
  if (logger == null) {
    if (isDev()) {
      fs.writeFileSync("./logs/world/debug.log", "");
      fs.writeFileSync("./logs/world/info.log", "");
    }

    logger = winston.createLogger({
      level: isDev() ? "info" : "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((data) => {
          const splatSymbol = Object.getOwnPropertySymbols(data).find((symbol) => symbol.description === "splat");
          let splatData: string = "";
          if (splatSymbol) {
            const splatValue = data[splatSymbol];
            splatData = JSON.stringify(splatValue);
          }

          return `${data.timestamp} ${data.level}: ${data.message} || ${splatData}`;
        })
      ),
      defaultMeta: {},
      transports: [
        isDev()
          ? new winston.transports.File({
              filename: "./logs/world/debug.log",
              level: "debug"
            })
          : new winston.transports.Console({ level: "error" }),
        isDev()
          ? new winston.transports.File({
              filename: "./logs/world/info.log",
              level: "info"
            })
          : new winston.transports.Console({ level: "error" })
      ]
    });
  }

  return logger;
};
