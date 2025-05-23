import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { Message } from "../types/Message";
import { decryptText } from "../utils/cryptoHelpers";
import { useUser } from "./UsernameContext";
import { useCrypto } from "./CryptoContext";

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
  updateAsExternal: (message: Message, key: CryptoKey | undefined) => void;
  refreshChatMessages: () => Promise<void>;
};

// Create context
const ChatMessagesContext = createContext<ChatMessagesContextValue | undefined>(
  undefined
);

export const ChatMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatMessagesReducer, {
    chatMessages: [],
  });
  const { username } = useUser();
  const { getPassword, deriveKey } = useCrypto();

  // Function to imperatively refresh chat messages
  const refreshChatMessages = useCallback(async () => {
    const password = getPassword();
    if (!password) throw new Error("No password set");

    // Take snapshot of current messages
    const snapshot = [...state.chatMessages];

    const updated = await Promise.all(
      snapshot.map(async (msg) => {
        // Skip messages that don't need decryption
        if (msg.sender === username) return msg;

        // Generate key from password
        const key = await deriveKey(
          password,
          Uint8Array.from(atob(msg.salt), (c) => c.charCodeAt(0))
        );

        if (!key) {
          console.error("Key derivation failed");
          return { ...msg, plaintext: "Error: Key derivation failed" };
        }

        try {
          const plaintext = await decryptText(msg.ciphertext, msg.iv, key);
          return { ...msg, plaintext };
        } catch (error) {
          console.error("Decryption error:", error);
          return { ...msg, plaintext: "Error: Decryption failed" };
        }
      })
    );

    dispatch({ type: "SET_MESSAGES", payload: updated });
  }, [deriveKey, getPassword, state.chatMessages, username]);

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
    async (message: Message, key: CryptoKey | undefined) => {
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
    [username]
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
