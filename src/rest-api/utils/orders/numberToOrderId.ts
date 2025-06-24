
export function numberToOrderId(num: number): string {
  const letterPart = Math.floor(num / 10000);
  const digitPart = num % 10000;

  const A_CODE = 'A'.charCodeAt(0);
  const l1 = Math.floor(letterPart / (26 * 26));
  const l2 = Math.floor((letterPart % (26 * 26)) / 26);
  const l3 = letterPart % 26;

  const letters =
    String.fromCharCode(A_CODE + l1) +
    String.fromCharCode(A_CODE + l2) +
    String.fromCharCode(A_CODE + l3);

  const digits = digitPart.toString().padStart(4, '0');

  return letters + digits;
}
