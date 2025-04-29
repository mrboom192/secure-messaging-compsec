const crypto = require("crypto");

const key = crypto.randomBytes(32); // AES-256 = 32 bytes
const algorithm = "aes-256-cbc";

function encrypt(plaintext) {
  const iv = crypto.randomBytes(16); // CBC mode needs 16-byte IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  return {
    ciphertext: encrypted,
    iv: iv.toString("base64"),
  };
}

function decrypt(ciphertext, ivBase64) {
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
