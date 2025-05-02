import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Message } from "../types/Message";

// Define context value shape
type ChatMessagesContextValue = {
  chatMessages: Message[];
  updateChatMessages: (message: Message) => void;
};

// Create context
const ChatMessagesContext = createContext<ChatMessagesContextValue | undefined>(
  undefined
);

// Provider
export const ChatMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const updateChatMessages = useCallback((message: Message) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  return (
    <ChatMessagesContext.Provider value={{ chatMessages, updateChatMessages }}>
      {children}
    </ChatMessagesContext.Provider>
  );
};

// Custom hook for consuming the context
export const useChatMessages = () => {
  const context = useContext(ChatMessagesContext);
  if (!context) {
    throw new Error(
      "useChatMessages must be used within a ChatMessagesProvider"
    );
  }
  return context;
};
