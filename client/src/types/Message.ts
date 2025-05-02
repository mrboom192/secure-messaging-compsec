export interface Message {
  id: string;
  sender: string;
  plaintext: string;
  ciphertext: string;
  timestamp: number;
}
