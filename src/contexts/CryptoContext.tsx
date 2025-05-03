import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useRef,
} from "react";

// Define the context type
interface CryptoContextType {
  password: string;
  setPassword: (pw: string) => void;
  getKey: () => CryptoKey | undefined;
  deriveNewKey: (password: string) => Promise<CryptoKey | undefined>;
}

// Create the context
const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: PropsWithChildren) {
  const [password, setPassword] = useState<string>("");

  // Use a ref to hold the latest key
  const keyRef = useRef<CryptoKey | undefined>(undefined);

  const deriveNewKey = async (password: string) => {
    if (!password) return;

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
        salt: encoder.encode("static-or-dynamic-salt"),
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

  const getKey = () => keyRef.current;

  return (
    <CryptoContext.Provider
      value={{ password, setPassword, getKey, deriveNewKey }}
    >
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
