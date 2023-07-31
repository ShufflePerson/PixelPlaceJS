import { customRandomString } from "./customRandomString";

export function getCacheLocalAuth() {
    let cipher: any = {};
    cipher["0"] = "w", cipher["1"] = "s", cipher["2"] = "k", cipher["3"] = "h", cipher["4"] = "r", cipher["5"] = "y", cipher["6"] = "i", cipher["7"] = "c", cipher["8"] = "e", cipher["9"] = "m";
    let cipherAlias = cipher;
    let currentUnix = Math.round((new Date).getTime() / 1000) + 258;
    let currentUnixString = currentUnix + "";
    let unixCHars: any = currentUnixString.split("");
    let output = "";
    for (let unixChar in unixCHars) {
        unixChar == "0" && (output += customRandomString(3));
        if (unixChar == "1") {
            output += customRandomString(2);
        }
        unixChar == "2" && (output += customRandomString(3, 1));
        unixChar == "3" && (output += customRandomString(4));
        unixChar == "4" && (output += customRandomString(3, 1));
        unixChar == "5" && (output += customRandomString(2));
        unixChar == "6" && (output += customRandomString(4));
        unixChar == "7" && (output += customRandomString(2, 1));
        if (unixChar == "8") {
            output += customRandomString(3);
        }
        unixChar == "9" && (output += customRandomString(4));
        Math.floor(Math.random() * 2) === 0 ? output += cipherAlias[parseInt(unixCHars[unixChar])]["toUpperCase"]() : output += cipherAlias[parseInt(unixCHars[unixChar])], output += unixCHars[unixChar];
    }
    output = output + "=";
    return output;

}
