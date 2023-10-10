function getCurrentTimeInSeconds(): number {
	return Math.floor(new Date().getTime() / 1000);
}

function getRandomIntInRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomString(length: number): string {
	const characters = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const characterCount = characters.length;
	const result: string[] = [];

	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * characterCount)));
	}

	return result.join('');
}

function generateComplexString(length: number): string {
	const characters = "gmbonjklezcfxta1234567890GMBONJKLEZCFXTA";
	const characterCount = characters.length;
	const result: string[] = [];

	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * characterCount)));
	}

	return result.join('');
}

const numberToCharMap: Record<number, string> = {
	0: 'g', 1: 'n', 2: 'b', 3: 'r', 4: 'z', 5: 's', 6: 'l', 7: 'x', 8: 'i', 9: 'o'
};

const userId = 3; //TODO: Make dynamic in the future,

export function getPalive(tDelay: number): string {
	const stringLengths = [6, 5, 9, 4, 5, 3, 6, 6, 3];
	const currentTime = getCurrentTimeInSeconds() + tDelay - 5400;
	const currentTimeStr = currentTime.toString();
	const currentTimeDigits = currentTimeStr.split('');
	let result = '';
	let index = 0;

	while (index < stringLengths.length) {
		if (getRandomIntInRange(0, 1) === 1) {
			result += generateComplexString(stringLengths[index]);
		} else {
			result += generateRandomString(stringLengths[index]);
		}

		if (Math.floor(Math.random() * 2) === 0) {
			result += numberToCharMap[parseInt(currentTimeDigits[index])]?.toUpperCase() || '';
		} else {
			result += numberToCharMap[parseInt(currentTimeDigits[index])] || '';
		}
		index++;
	}

	if (getRandomIntInRange(0, 1) === 1) {
		result += userId + generateComplexString(getRandomIntInRange(4, 20));
	} else {
		result += userId + generateRandomString(getRandomIntInRange(4, 25));
	}

	result += '0=';

	return result;
}


let randomStringCharacters = ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", "gmbonjklezcfxtaGMBONJKLEZCFXTA"];


//not used in palive but used by other parts of the pxpjs code
export function customRandomString(outputLength: number, listId: number = 0) {
	var output: string[] = [];
	let alphabet = randomStringCharacters[listId];
	let length = alphabet.length;
	for (var jarelin = 0; jarelin < outputLength; jarelin++) {
		output.push(alphabet.charAt(Math.floor(Math.random() * length)));
	}
	return output.join("");
}

//raw latest palive
//
/*

var randomVariant1 = e; //...(length) 
var randomVariant2 = h; //...(length)
var Z = {0: 'g', 1: 'n', 2: 'b', 3: 'r', 4: 'z', 5: 's', 6: 'l', 7: 'x', 8: 'i', 9: 'o'};


function h(length) {
  var AB = [];
  var AM = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var AN = AM.length;
  for (var Ag = 0; Ag < length; Ag++) {
    AB.push(AM.charAt(Math.floor(Math.random() * AN)));
  }
  return AB.join("");
}


function e(length) {
  var AB = [];
  var AM = "gmbonjklezcfxta1234567890GMBONJKLEZCFXTA";
  var AN = AM.length;
  for (var Ag = 0; Ag < length; Ag++) {
    AB.push(AM.charAt(Math.floor(Math.random() * AN)));
  }
  return AB.join("");
}


//randomNumber...(min, max)
function A3(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentTime() {
 return parseInt((new Date).getTime() / 1e3);
}



function getPalive(tDelay, userIdDigit) {
  let sV =  [6, 5, 9, 4, 5, 3, 6, 6, 3]
  var B0 = getCurrentTime() + tDelay - 5400;
  var B1 = B0.toString();
  B2 = B1.split("");
  B3 = "";
  B4 = 0;
  B5 = 0;
  while (B4 < sV.length) {
    A3(0, 1) == 1 ? B3 += e(sV[B4]) : B3 += h(sV[B4]);
    if (Math.floor(Math.random() * 2) === 0) B3 += Z[parseInt(B2[B4])]["toUpperCase"](); else {
		B3 += Z[parseInt(B2[B4])];
    }
    B4++;
  }
  if (A3(0, 1) == 1) {
    B3 += userIdDigit + e(A3(4, 20));
  } else B3 += userIdDigit + h(A3(4, 25));
  B3 = B3 + "0="
  
  return B3;
}


*/
