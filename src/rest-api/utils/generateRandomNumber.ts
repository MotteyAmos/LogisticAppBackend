import crypto from "crypto"

export function generateRandomNumber() {
  const randomBytes = crypto.randomBytes(3); // Generate 3 bytes (5 characters in hexadecimal representation)
  const randomNumber = parseInt(randomBytes.toString('hex'), 16).toString().slice(0, 5);
  return randomNumber;
}