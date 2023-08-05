import winston from "winston";

function registerTransports() {
  winston.add(
    new winston.transports.Console({
      debugStdout: true,
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
      )
    })
  );
}

export default registerTransports;
