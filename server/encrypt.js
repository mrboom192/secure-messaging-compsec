const crypto = require("crypto");
//shared passphrase
const password = 'shared-secret';

// Generate a random key from the passphrase
function deriveKey(salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

//encyprtion algorithm using AES-256-CBC
function encrypt(plaintext) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  const key = deriveKey(salt);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");

  return {
    ciphertext,
    iv: iv.toString("base64"),
    salt: salt.toString("base64"),
  };
}

// Decryption algorithm using AES-256-CBC
function decrypt(ciphertext, ivBase64, saltBase64) {
    const iv = Buffer.from(ivBase64, "base64");
    const salt = Buffer.from(saltBase64, "base64");
    const key = deriveKey(salt);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let plaintext = decipher.update(ciphertext, "base64", "utf8");
    plaintext += decipher.final("utf8");
    return plaintext;
}

module.exports = { encrypt, decrypt };
