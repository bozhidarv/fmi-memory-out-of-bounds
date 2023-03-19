export type MonstersT = {
  equation: string;
  answer: number[];
};

function giveAnswerArray(answer: number): number[] {
  return answer
    .toString()
    .split("")
    .map((char) => parseInt(char));
}

function fixEquation(eq: string): string {
  if (eq.length === 5) {
    return eq;
  }

  const symbol =
    eq.split("").find((char) => char === "+" || char === "-" || char === "*") ??
    "";

  const splitArr = eq.split(symbol);

  if (splitArr[0].length < 2) {
    splitArr[0] = `0${splitArr[0]}`;
  }

  if (splitArr[1].length < 2) {
    splitArr[1] = `0${splitArr[1]}`;
  }

  return `${splitArr[0]}${symbol}${splitArr[1]}`;
}

export function generateEquation(answerDigits: number): MonstersT {
  const operation = Math.round(Math.random() * 2 + 1);

  switch (operation) {
    case 1:
      return generateSubEquation(answerDigits);
    case 2:
      return generateAddEquation(answerDigits);
    default:
      return generateMultiEquation(answerDigits);
  }
}

export function generateAddEquation(answerDigits: number): MonstersT {
  const answerLength = Math.pow(10, answerDigits);
  const answer = Math.round(Math.random() * answerLength);

  const firstNumberLength = Math.pow(10, answerDigits - 1);
  const firstNumber = Math.round(Math.random() * firstNumberLength);

  const secondNumber = answer - firstNumber;

  if (secondNumber < 0) {
    return generateAddEquation(answerDigits);
  }

  const equation = `${firstNumber}+${secondNumber}`;

  return {
    equation: fixEquation(equation),
    answer: giveAnswerArray(answer),
  };
}

export function generateSubEquation(answerDigits: number): MonstersT {
  const answerLength = Math.pow(10, answerDigits);
  const answer = Math.round(Math.random() * answerLength);

  const firstNumberLength = Math.pow(10, 2);
  const firstNumber = Math.round(Math.random() * firstNumberLength);

  const secondNumber = firstNumber - answer;

  if (secondNumber < 0) {
    return generateSubEquation(answerDigits);
  }

  const equation = `${firstNumber}-${secondNumber}`;

  return {
    equation: fixEquation(equation),
    answer: giveAnswerArray(answer),
  };
}

export function generateMultiEquation(answerDigits: number): MonstersT {
  const numberLength = Math.pow(10, Math.sqrt(answerDigits));

  const firstNumber = Math.round(Math.random() * numberLength);

  const secondNumber = Math.round(Math.random() * numberLength);

  const answer = firstNumber * secondNumber;

  if (answer.toString().length !== answerDigits) {
    return generateMultiEquation(answerDigits);
  }
  const equation = `${firstNumber}*${secondNumber}`;

  return {
    equation: fixEquation(equation),
    answer: giveAnswerArray(answer),
  };
}

function getDigit(): number {
  return Math.round(Math.random() * 9);
}

export function generateSingleDigitEq(): MonstersT {
  const digit = getDigit();
  return {
    equation: digit.toString(),
    answer: [digit],
  };
}

export function generateMatrix(answerDigits: number): MonstersT {
  const digitOne = getDigit();
  const digitTwo = getDigit();
  const digitThree = getDigit();
  const digitFour = getDigit();

  const answer = digitOne * digitTwo - digitThree * digitFour;

  if (answer < 0 || answer.toString().length > answerDigits) {
    return generateMatrix(answerDigits);
  }

  const equation = `${digitOne}${digitThree}${digitFour}${digitTwo}`;
  return {
    equation,
    answer: giveAnswerArray(answer),
  };
}
