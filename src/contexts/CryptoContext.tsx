import { createContext, useContext, PropsWithChildren, useRef } from "react";

// Define the context type
interface CryptoContextType {
  deriveKey: (
    password: string | null,
    salt: Uint8Array
  ) => Promise<CryptoKey | undefined>;
  getPassword: () => string | null;
  setPassword: (password: string) => void;
}

// Key was automatically updated

// Create the context
const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: PropsWithChildren) {
  // Store the salt and key
  // const saltRef = useRef<Uint8Array | null>(null);
  const passwordRef = useRef<string | null>(null);
  const keyRef = useRef<CryptoKey | undefined>(undefined);

  const setPassword = (password: string) => {
    passwordRef.current = password;
  };

  const getPassword = () => passwordRef.current;

  const deriveKey = async (password: string | null, salt: Uint8Array) => {
    if (!password) return undefined;

    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    keyRef.current = derivedKey; // Update the ref too
    return derivedKey;
  };

  return (
    <CryptoContext.Provider value={{ getPassword, setPassword, deriveKey }}>
      {children}
    </CryptoContext.Provider>
  );
}

// Custom hook to consume CryptoContext
export function useCrypto(): CryptoContextType {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
}
