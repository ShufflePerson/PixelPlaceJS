import EPackets from "../../../Enums/EPackets";

function getEmitMessage(identifier: EPackets, data: any) {
    let message = `42["${identifier}",${JSON.stringify(data)}]`
    return message;
}

export default getEmitMessage;