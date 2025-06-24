

export function indexToOrderId(index: number): string {
  const lettersCount = 26;
  const totalDigits = 10000;

  const letterPart = Math.floor(index / totalDigits);
  const digitPart = index % totalDigits;

  const first = String.fromCharCode(65 + Math.floor(letterPart / (lettersCount * lettersCount)) % lettersCount);
  const second = String.fromCharCode(65 + Math.floor(letterPart / lettersCount) % lettersCount);
  const third = String.fromCharCode(65 + letterPart % lettersCount);
  const digits = digitPart.toString().padStart(4, "0");

  return `${first}${second}${third}${digits}`;
}