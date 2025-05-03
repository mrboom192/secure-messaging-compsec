export interface Message {
  id: string;
  sender: string;
  plaintext?: string;
  iv: string;
  ciphertext: string;
  timestamp: number;
}
