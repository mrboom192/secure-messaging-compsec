import { useCallback } from "react";

import { Message } from "../types/Message";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { useChatMessages } from "../contexts/ChatContext";
import { nanoid } from "nanoid";

export const useChat = () => {
  const { chatMessages, sendChatMessage } = useChatMessages();

  const {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    startAsSlave,
    setRemoteConnectionDescription,
    sendMessage,
  } = usePeerConnection();

  const sendTextChatMessage = useCallback(
    (messageText: string, senderName: string) => {
      // Create a new message object
      const message: Message = {
        id: nanoid(),
        sender: senderName,
        plaintext: messageText,
        ciphertext: "", // Fill in later
        timestamp: +new Date(),
      };

      sendMessage(message);
      sendChatMessage({
        id: message.id,
        sender: message.sender,
        plaintext: message.plaintext,
        ciphertext: message.ciphertext,
        timestamp: message.timestamp,
      });
    },
    [sendMessage, sendChatMessage]
  );

  return {
    mode,
    isConnected,
    localConnectionDescription,
    chatMessages,
    startAsHost,
    startAsSlave,
    setRemoteConnectionDescription,
    sendTextChatMessage,
  };
};
