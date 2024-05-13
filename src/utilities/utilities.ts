import { HmacSHA256 } from "crypto-js";
import { AIMessage } from "../interfaces/chatInterfaces";

export function createSignature(data: AIMessage[], timestamp: string) {
  const secretKey = process.env.EXPO_PUBLIC_APPCHECK;
  if (!secretKey) {
    throw new Error(
      "Secret key is not defined. Check your environment configuration."
    );
  }
  const hmac = HmacSHA256(JSON.stringify(data) + timestamp, secretKey);

  return hmac.toString();
}
