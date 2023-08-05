export function getPalive(): string {
  var currentTime = Math.round(new Date().getTime() / 1000) + 1678;
  currentTime = Math.round(currentTime);
  let currentTimeString = currentTime.toString();
  let currentTimeChars = currentTimeString.split("");
  let finalString = "";
  let granpaCipher: any = {};
  (granpaCipher["0"] = "g"),
    (granpaCipher["1"] = "m"),
    (granpaCipher["2"] = "b"),
    (granpaCipher["3"] = "o"),
    (granpaCipher["4"] = "z"),
    (granpaCipher["5"] = "c"),
    (granpaCipher["6"] = "l"),
    (granpaCipher["7"] = "x"),
    (granpaCipher["8"] = "t"),
    (granpaCipher["9"] = "a");

  for (var currentTimeChar in currentTimeChars) {
    currentTimeChar == "0" && (finalString += customRandomString(5)),
      currentTimeChar == "1" && (finalString += customRandomString(7)),
      currentTimeChar == "2" && (finalString += customRandomString(3, 1)),
      currentTimeChar == "3" && (finalString += customRandomString(8)),
      currentTimeChar == "4" && (finalString += customRandomString(6, 1)),
      currentTimeChar == "5" && (finalString += customRandomString(3)),
      currentTimeChar == "6" && (finalString += customRandomString(6)),
      currentTimeChar == "7" && (finalString += customRandomString(4, 1)),
      currentTimeChar == "8" && (finalString += customRandomString(7)),
      currentTimeChar == "9" && (finalString += customRandomString(6));

    let finalSuffix = granpaCipher[currentTimeChars[currentTimeChar]];

    finalString += finalSuffix;
  }
  finalString += "0=";

  return finalString;
}

let randomStringCharacters = ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", "gmbonjklezcfxtaGMBONJKLEZCFXTA"];

export function customRandomString(outputLength: number, listId: number = 0) {
  var output: string[] = [];
  let alphabet = randomStringCharacters[listId];
  let length = alphabet.length;
  for (var jarelin = 0; jarelin < outputLength; jarelin++) {
    output.push(alphabet.charAt(Math.floor(Math.random() * length)));
  }
  return output.join("");
}
