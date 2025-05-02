import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Message } from "../types/Message";
import { useCrypto } from "./CryptoContext";
import { usePeerConnection } from "./PeerConnectionContext";
import { decryptText } from "../utils/cryptoHelpers";

// Extended Message with optional plaintext
type DecryptedMessage = Message & { plaintext?: string };

// Define context value shape
type ChatMessagesContextValue = {
  chatMessages: DecryptedMessage[];
  updateChatMessages: (message: Message) => void;
};

// Create context
const ChatMessagesContext = createContext<ChatMessagesContextValue | undefined>(
  undefined
);

export const ChatMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState<DecryptedMessage[]>([]);
  const { key } = useCrypto();
  const { currentUserName } = usePeerConnection();

  // Constantly decrypt all messages as they update and the key changes
  // Inefficient ik but good for user experience
  useEffect(() => {
    if (!key) return;

    const reDecryptAll = async () => {
      const updatedMessages = await Promise.all(
        chatMessages.map(async (msg) => {
          // Skip decryption for messages from the current user
          if (msg.sender === currentUserName) return msg;

          try {
            const plaintext = await decryptText(msg.ciphertext, msg.iv, key);
            return { ...msg, plaintext };
          } catch {
            return { ...msg, plaintext: "Error: Decryption failed" };
          }
        })
      );

      setChatMessages(updatedMessages);
    };

    reDecryptAll();
  }, [key]); // DO NOT LISTEN TO ESLINT WHEN IT ASKS YOU TO ADD chatMessages AS A DEPENDENCY

  // Add one new message
  const updateChatMessages = async (message: Message) => {
    // Skip decryption for messages from the sender
    if (message.sender === currentUserName) {
      setChatMessages((prev) => [...prev, message]);
      return;
    }

    if (!key) {
      setChatMessages((prev) => [
        ...prev,
        { ...message, plaintext: "Error: No key available" },
      ]);
      return;
    }

    try {
      const plaintext = await decryptText(message.ciphertext, message.iv, key);
      setChatMessages((prev) => [...prev, { ...message, plaintext }]);
    } catch (e) {
      console.error("Decryption failed:", e);
      setChatMessages((prev) => [
        ...prev,
        { ...message, plaintext: "Error: Decryption failed" },
      ]);
    }
  };

  return (
    <ChatMessagesContext.Provider value={{ chatMessages, updateChatMessages }}>
      {children}
    </ChatMessagesContext.Provider>
  );
};

export const useChatMessages = () => {
  const context = useContext(ChatMessagesContext);
  if (!context) {
    throw new Error(
      "useChatMessages must be used within a ChatMessagesProvider"
    );
  }
  return context;
};
