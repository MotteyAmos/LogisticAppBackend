



export function orderIdToNumber(orderId: string): number {
  const letters = orderId.slice(0, 3);
  const digits = parseInt(orderId.slice(3), 10);

  // Convert letters (base-26)
  const A_CODE = 'A'.charCodeAt(0);
  const letterValue =
    (letters.charCodeAt(0) - A_CODE) * 26 * 26 +
    (letters.charCodeAt(1) - A_CODE) * 26 +
    (letters.charCodeAt(2) - A_CODE);

  // Total permutations = (letters * 10,000) + digits
  return letterValue * 10000 + digits;
}
