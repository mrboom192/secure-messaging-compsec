import { useCallback } from "react";

import { Message } from "../types/Message";
import { usePeerConnection } from "../contexts/PeerConnectionContext";
import { useChatMessages } from "../contexts/ChatContext";
import { nanoid } from "nanoid";

export const useChat = () => {
  const { chatMessages, updateChatMessages } = useChatMessages();
  const { currentUserName } = usePeerConnection();

  const {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    startAsParticipant,
    setRemoteConnectionDescription,
    sendMessage,
  } = usePeerConnection();

  const sendTextChatMessage = useCallback(
    (messageText: string) => {
      // TODO: Encrypt the message before sending (create ciphertext)

      // Create a new message object
      const message: Message = {
        id: nanoid(),
        sender: currentUserName,
        plaintext: messageText,
        ciphertext: "", // Fill in later
        timestamp: +new Date(),
      };

      // Send the message over the peer connection
      sendMessage(message);

      // Update local chat messages
      updateChatMessages({
        id: message.id,
        sender: message.sender,
        plaintext: message.plaintext,
        ciphertext: message.ciphertext,
        timestamp: message.timestamp,
      });
    },
    [currentUserName, sendMessage, updateChatMessages]
  );

  return {
    mode,
    isConnected,
    localConnectionDescription,
    chatMessages,
    startAsHost,
    startAsParticipant,
    setRemoteConnectionDescription,
    sendTextChatMessage,
  };
};
