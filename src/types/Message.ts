export interface Message {
  id: string; // message id
  sender: string; // sender name
  plaintext?: string; // only used for local messages
  iv: string; // we need to send iv so that peer knows how to decrypt the message
  salt: string; // salt used to derive the key
  ciphertext: string; // message ciphertext
  timestamp: number; // timestamp of the message
}
