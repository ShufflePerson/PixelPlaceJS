import IFightEnd from "../../Types/Misc/Fight/IFightEnd";
import getWorldLogger from '../../../Logging/World/getWorldLogger'

const logger = getWorldLogger();

function onFightEnd(data: IFightEnd) {
    logger.log("info", "Fight has ended. ", "onFightEnd", data.canvas);
}

export { onFightEnd }