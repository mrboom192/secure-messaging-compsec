// Utility to convert base64 to bytes
function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

// Utility to convert bytes to base64
function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

// Generate random IV or salt
function getRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

// Derive AES key from password and salt using PBKDF2
export async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-CBC",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt a message
export async function encryptMessage(plaintext: string, password: string) {
  const iv = getRandomBytes(16);
  const salt = getRandomBytes(16);
  const key = await deriveKey(password, salt);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    new TextEncoder().encode(plaintext)
  );

  return {
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt),
  };
}

// Decrypt a message
export async function decryptMessage(
  ciphertextBase64: string,
  ivBase64: string,
  saltBase64: string,
  password: string
): Promise<string> {
  const iv = base64ToBytes(ivBase64);
  const salt = base64ToBytes(saltBase64);
  const ciphertext = base64ToBytes(ciphertextBase64);
  const key = await deriveKey(password, salt);

  const plaintextBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintextBuffer);
}
