import isDev from "./isDev";
import registerTransports from "./registerTransports";

function initLogger(dev: boolean = isDev()) {
  registerTransports(dev);
}

export default initLogger;
