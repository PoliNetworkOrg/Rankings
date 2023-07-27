import { SALT } from "../constants";

export async function sha256(input: string, salt = SALT): Promise<string> {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(input + salt);

  // hash the input
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");
  return hashHex;
}
