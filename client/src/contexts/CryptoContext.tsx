import { createContext, useState, useContext, PropsWithChildren } from "react";

// Define the context type
interface CryptoContextType {
  password: string;
  setPassword: (pw: string) => void;
  key: CryptoKey | undefined;
  deriveNewKey: (password: string) => Promise<void>;
}

// Create the context
const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: PropsWithChildren) {
  const [password, setPassword] = useState<string>("");
  const [key, setKey] = useState<CryptoKey | undefined>(undefined);

  const deriveNewKey = async (password: string) => {
    if (!password) return; // Don't derive key if password is empty

    const encoder = new TextEncoder(); // Need to encode the password for it to be used with crypto

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    // Derive the key using PBKDF2
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("static-or-dynamic-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    setKey(derivedKey);
  };

  return (
    <CryptoContext.Provider
      value={{ password, setPassword, key, deriveNewKey }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

// Safer hook with error handling
export function useCrypto(): CryptoContextType {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
}
