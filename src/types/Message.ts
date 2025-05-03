export interface Message {
  id: string; // message id
  sender: string; // sender name
  plaintext?: string; // message plaintext
  iv: string; // we need to send iv so that peer knows how to decrypt the message
  ciphertext: string; // message ciphertext
  timestamp: number; // timestamp of the message
}
