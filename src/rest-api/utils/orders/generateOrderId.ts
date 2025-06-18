


export function incrementOrderId(currentId: string): string {
  const charPart = currentId.slice(0, 3);
  const numPart = parseInt(currentId.slice(3), 10);

  let newNum = numPart + 1;
  let newNumStr = newNum.toString().padStart(4, '0');

  let newCharPart = charPart;

  // Reset number and increment char part if number overflows
  if (newNum > 9999) {
    newNumStr = '0000';
    newCharPart = incrementCharPart(charPart);
  }

  return `${newCharPart}${newNumStr}`;
}

function incrementCharPart(charPart: string): string {
  let chars = charPart.split('');
  for (let i = chars.length - 1; i >= 0; i--) {
    if (chars[i] === 'Z') {
      chars[i] = 'A';
    } else {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      break;
    }
  }
  return chars.join('');
}
