export const findIndex = (model, array) => {
  return array.indexOf(model);
};

export const validateDigitLoincCode = (number) => {
  var validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";
  number = number.toUpperCase().trim();
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let ch = number.charAt(number.length - i - 1);
    if (validChars.indexOf(ch) < 0) {
      alert("Invalid character(s) found!");
      return false;
    }
    let digit = ch.charCodeAt(0) - 48;
    let weight;
    if (i % 2 === 0) {
      weight = 2 * digit - parseInt(digit / 5) * 9;
    } else {
      weight = digit;
    }
    sum += weight;
  }
  sum = Math.abs(sum) + 10;
  return (10 - (sum % 10)) % 10;
};

export const validateLoincCode = (code) => {
  console.log(code);
  if (code !== "" && code != null) {
    const splitCode = code.toUpperCase().trim().split("-");
    console.log("splitCode", splitCode);

    var validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";

    let number = splitCode[0].toUpperCase().trim();

    console.log("number", number);
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
      let ch = number.charAt(number.length - i - 1);
      if (validChars.indexOf(ch) < 0) {
        return false;
      }
      let digit = ch.charCodeAt(0) - 48;
      let weight;
      if (i % 2 === 0) {
        weight = 2 * digit - parseInt(digit / 5) * 9;
      } else {
        weight = digit;
      }
      sum += weight;
    }
    sum = Math.abs(sum) + 10;
    let finaldigit = (10 - (sum % 10)) % 10;

    console.log("finaldigit", finaldigit);

    return Number.parseInt(splitCode[1]) === finaldigit;
  } else {
    return false;
  }
};

export function groupBy(objectArray, property) {
  return objectArray.reduce(function (accumulator, object) {
    let key = object[property];
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(object);
    return accumulator;
  }, {});
}

export const getTimes = (time) => {
  const parsedTime = parseInt(time);
  let times = [];

  for (let i = parsedTime; i < 24; i++) {
    if (i < 10) {
      i = `0${i}`;
    }
    times.push(i);
  }
  return times;
};
