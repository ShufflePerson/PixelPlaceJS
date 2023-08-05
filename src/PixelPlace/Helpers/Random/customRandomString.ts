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
