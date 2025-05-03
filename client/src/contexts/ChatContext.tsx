import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { Message } from "../types/Message";
import { useCrypto } from "./CryptoContext";
import { decryptText } from "../utils/cryptoHelpers";
import { useUser } from "./UsernameContext";

// Extended Message with optional plaintext
type DecryptedMessage = Message & { plaintext?: string };

// Reducer state and actions
type State = {
  chatMessages: DecryptedMessage[];
};

type Action =
  | { type: "ADD_MESSAGE"; payload: DecryptedMessage }
  | { type: "SET_MESSAGES"; payload: DecryptedMessage[] };

// Reducer to manage chat messages safely, even during async updates
const chatMessagesReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { chatMessages: [...state.chatMessages, action.payload] };
    case "SET_MESSAGES":
      return { chatMessages: action.payload };
    default:
      return state;
  }
};

// Define context value shape
type ChatMessagesContextValue = {
  chatMessages: DecryptedMessage[];
  updateAsLocal: (message: Message) => void;
  updateAsExternal: (message: Message) => void;
  refreshChatMessages: (decryptionKey: CryptoKey | undefined) => Promise<void>;
};

// Create context
const ChatMessagesContext = createContext<ChatMessagesContextValue | undefined>(
  undefined
);

export const ChatMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatMessagesReducer, {
    chatMessages: [],
  });
  const { key } = useCrypto();
  const { username } = useUser();

  // Function to imperatively refresh chat messages
  const refreshChatMessages = useCallback(
    async (decryptionKey: CryptoKey | undefined) => {
      if (!decryptionKey) throw new Error("Key is not available");

      // Snapshot current state to avoid race conditions
      const snapshot = [...state.chatMessages];

      const updated = await Promise.all(
        snapshot.map(async (msg) => {
          // Skip messages that don't need decryption
          if (msg.sender === username) return msg;

          try {
            const plaintext = await decryptText(
              msg.ciphertext,
              msg.iv,
              decryptionKey
            );
            return { ...msg, plaintext };
          } catch (error) {
            console.error("Decryption error:", error);
            return { ...msg, plaintext: "Error: Decryption failed" };
          }
        })
      );

      dispatch({ type: "SET_MESSAGES", payload: updated });
    },
    [state.chatMessages, username]
  );

  // Add one new message if it is from the current user
  const updateAsLocal = useCallback(
    (message: Message) => {
      // Just in case, although this function shouldn't be used for external messages
      if (message.sender !== username) return;
      dispatch({ type: "ADD_MESSAGE", payload: message });
    },
    [username]
  );

  // Add one new message if it is from an external user
  const updateAsExternal = useCallback(
    async (message: Message) => {
      // Just in case, although this function shouldn't be used for local messages
      if (message.sender === username) return;

      // If there is no key, we cannot decrypt the message
      if (!key) {
        dispatch({
          type: "ADD_MESSAGE",
          payload: { ...message, plaintext: "Error: Please set a key" },
        });
        return;
      }

      try {
        const plaintext = await decryptText(
          message.ciphertext,
          message.iv,
          key
        );
        dispatch({
          type: "ADD_MESSAGE",
          payload: { ...message, plaintext },
        });
      } catch (e) {
        console.error("Decryption failed:", e);
        dispatch({
          type: "ADD_MESSAGE",
          payload: { ...message, plaintext: "Error: Decryption failed" },
        });
      }
    },
    [key, username]
  );

  return (
    <ChatMessagesContext.Provider
      value={{
        chatMessages: state.chatMessages,
        updateAsLocal,
        updateAsExternal,
        refreshChatMessages,
      }}
    >
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
